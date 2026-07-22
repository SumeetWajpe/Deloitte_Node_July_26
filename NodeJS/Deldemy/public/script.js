// make ajax request - fetch api / axios  -> /courses -> console.log(course)

async function FetchCourses() {
  const res = await fetch("http://localhost:3000/courses");
  let listofcourses = await res.json();

  for (const course of listofcourses) {
    CreateCourseItem(course);
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
  </div>
</div>`;

  courseList.appendChild(newCol);
}

window.addEventListener("DOMContentLoaded", FetchCourses);
