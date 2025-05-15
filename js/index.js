document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");

  if (username === "RobColesky") {
    document.getElementById("postBlogLink").style.display = "inline-block";
    document.getElementById("postlistinglink").style.display = "inline-block";
    document.getElementById("loginLink").style.display = "none";
  } else {
    document.getElementById("postBlogLink").style.display = "none";
    document.getElementById("postlistinglink").style.display = "none";
    document.getElementById("loginLink").style.display = "inline-block";
  }
});