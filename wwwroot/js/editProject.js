api = "http://localhost:5234";

async function Submit() {
  const inputSkill = document.getElementById("skill").value;
  const datalist = document.getElementById("skills");

  const selectedOption = [...datalist.children].find(
    (option) => option.value === inputSkill
  );

  if (selectedOption) {
    const skillId = selectedOption.dataset.id;
    EditProject(skillId);
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
      EditProject(data.id);
    } catch (error) {
      CreateErrorBlock("Edit Skill failed. Please check your information.");
    }
  }
}

async function EditProject(skillId) {
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
      throw new Error(`Edit Project failed: ${response.status}`);
    }
    window.location.href = `${api}/Profile`;
  } catch (error) {
    CreateErrorBlock("Edit Project failed. Please check your information.");
  }
}

async function SearchSkill() {
  const skill = document.getElementById("skill").value;
  if (skill.length < 3) return;
  const body = { title: skill, limit: 2 };
  try {
    const response = await fetch(`${api}/Skill?${body}`, {
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
