let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  setUpForm()
  getToyData()
});


const setUpForm = () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form")
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault()
    createToy(e)
  })


  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
}

const getToyData = () => {
  fetch("http://localhost:3000/toys")
  .then((resp) => resp.json())
  .then(toyData => toyData.forEach((toy) => renderToy(toy)))
  // v This does the same thing as this ^
  // .then(toyData => {
  //   toyData.forEach(toy => {
  //     console.log(toy)
  //   })
  // })
}

const createToy = (e) => {
  console.log(e.target.name.value)
  console.log(e.target.image.value)
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    })
  })
  .then(res => res.json())
  .then(newToy => renderToy(newToy))
}


const renderToy = (toy) => {
  const toyCollection = document.querySelector("#toy-collection")
  const toyCard = document.createElement("div")
  toyCard.className = "card"

  const toyHeader = document.createElement("h2")
  toyHeader.innerText = toy.name

  const toyImg = document.createElement("img")
  toyImg.src = toy.image
  toyImg.className = "toy-avatar"

  const toyLikes = document.createElement("p")
  toyLikes.innerText = `${toy.likes} likes`

  const likeBtn = document.createElement("button")
  likeBtn.className = "like-btn"
  likeBtn.id = toy.id
  likeBtn.innerText = "Like <3"

  likeBtn.addEventListener("click", (e) => {
    addLike(toy, e)
  })

  toyCard.append(toyHeader, toyImg, toyLikes, likeBtn)
  toyCollection.append(toyCard)
}


const addLike = (toy, e) => {
  toy.likes = toy.likes + 1
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: toy.likes
    })
  })
  .then(res => res.json())
  .then(updatedToy => {
    e.target.parentElement.childNodes[2].innerText = `${updatedToy.likes} likes`
  })
}