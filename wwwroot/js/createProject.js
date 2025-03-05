api = "http://localhost:5234";

async function Submit() {
  const inputSkill = document.getElementById("skill").value;
  const datalist = document.getElementById("skills");

  const selectedOption = [...datalist.children].find(
    (option) => option.value === inputSkill
  );

  if (selectedOption) {
    const skillId = selectedOption.dataset.id;
    CreateProject(skillId);
  } else {
    const body = { title: inputSkill };
    try {
      const response = await fetch(`${api}/Skill`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Create Skill failed: ${response.status}`);
      }

      const data = await response.json();
      CreateProject(data.id);
    } catch (error) {
      CreateErrorBlock("Edit Skill failed. Please check your information.");
    }
  }
}

async function CreateProject(skillId) {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  try {
    const response = await fetch(`${api}/Project`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({ title, description, skillId }),
    });

    if (!response.ok) {
      throw new Error(`Create Project failed: ${response.status}`);
    }
    window.location.href = `${api}/Profile`;
  } catch (error) {
    CreateErrorBlock("Create Project failed. Please check your information.");
  }
}

async function SearchSkill() {
  const skill = document.getElementById("skill").value;
  if (skill.length < 1) return;
  try {
    const response = await fetch(`${api}/Skill?Title=${skill}&Limit=2`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Edit Project failed: ${response.status}`);
    }

    const data = await response.json();
    CreateOption(data);
  } catch (error) {
    CreateErrorBlock("Enter Wrong Skill");
  }
}

function CreateOption(information) {
  const skills = document.getElementById("skills");
  skills.innerHTML = "";
  skills.id = "skills";
  information.forEach((data) => {
    const value = document.createElement("option");
    value.value = data.title;
    value.dataset.id = data.id;
    skills.appendChild(value);
  });
}
