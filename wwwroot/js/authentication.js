api = "http://localhost:5234";

if (getCookie("token") === null) {
  window.location.replace(`${api}/Home/Intro`);
}
