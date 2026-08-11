// make ajax request - fetch api / axios  -> /courses -> console.log(course)

function getToken() {
  return localStorage.getItem("token");
}

function isLoggedIn() {
  return !!getToken();
}

function Logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

async function Login(event) {
  event.preventDefault();
  const email = document.getElementById("txtEmail").value;
  const password = document.getElementById("txtPassword").value;

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }
      // token stored on client
    localStorage.setItem("token", data.token);
    alert("Logged in successfully!");
    window.location.href = "/";
  } catch (error) {
    alert(error.message);
  }
}

async function Register(event) {
  event.preventDefault();
  const name = document.getElementById("txtName").value;
  const email = document.getElementById("txtRegEmail").value;
  const password = document.getElementById("txtRegPassword").value;

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    alert("Account created — you can log in now.");
  } catch (error) {
    alert(error.message);
  }
}

// Swaps the nav's "Login" link for a "Logout" link/button when a token is present.
function UpdateAuthNav() {
  const navList = document.querySelector(".navbar-nav");
  if (!navList) return;

  const loginLink = navList.querySelector('a[href="Login.html"]');
  if (isLoggedIn() && loginLink) {
    const li = loginLink.closest("li");
    li.innerHTML = `<a class="nav-link" href="#" onclick="Logout()">Logout</a>`;
  }
}

async function FetchCourses() {
  try {
    const res = await fetch("http://localhost:3000/courses");
    let listofcourses;
    if (!res.ok) {
      throw new Error("Something went wrong ");
    } else {
      listofcourses = await res.json();
    }

    for (const course of listofcourses) {
      CreateCourseItem(course);
    }
  } catch (error) {
    console.log(error);
  }
}

async function DeleteACourse(id) {
  const token = getToken();
  if (!token) {
    alert("Please log in to delete a course.");
    window.location.href = "/Login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/courses/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    if (res.status === 401) {
      alert("Your session has expired — please log in again.");
      window.location.href = "/Login.html";
      return;
    }

    if (!res.ok) {
      throw new Error("Something went wrong ");
    }

    alert("Course deleted " + res.status);

    // Manipulate the DOM to remove the element
  } catch (error) {
    console.log(error);
  }
}

function CreateCourseItem(course) {
  let courseList = document.getElementById("listofcourses");
  let newCol = document.createElement("div");
  newCol.setAttribute("class", "col-md-3");

  newCol.innerHTML = `<div class="card mt-2">
 <a href="/coursedetails/${course.id}"> <img src=${course.imageUrl} class="card-img-top" height="200px" alt=${course.title}> </a>
  <div class="card-body">
    <h5 class="card-title">${course.title}</h5>
    <p class="card-text">₹. ${course.price}</p>
    <p class="card-text"> ${course.rating}</p>
    <p class="card-text"> ${course.trainer}</p>
    <button class="btn btn-outline-primary">${course.likes}</button>
    <button class="btn btn-outline-danger" onclick="DeleteACourse(${course.id})">Delete</button>

  </div>
</div>`;

  courseList.appendChild(newCol);
}

window.addEventListener("DOMContentLoaded", () => {
  FetchCourses();
  UpdateAuthNav();
});
