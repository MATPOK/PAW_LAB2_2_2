(function() {
  const example = document.getElementById('example');
  const cw1 = document.getElementById('cw1');
  const cw2 = document.getElementById('cw2');
  const cw3 = document.getElementById('cw3');
  const answer = document.getElementById('answer');

  function LoadingPopup() {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "popup";
    loadingDiv.textContent = "Loading…";
    document.body.appendChild(loadingDiv);
    return loadingDiv;
  }

  example.addEventListener("click", function() {
    fetch('https://my-json-server.typicode.com/MATPOK/PAW_LAB2_JSON/posts')
      .then(response => response.json())
      .then(array => {
        console.log(array);
        answer.innerHTML = JSON.stringify(array);
      });
  });

  cw1.addEventListener("click", function() {
    const loading = LoadingPopup();

    Promise.all([
      fetch('https://my-json-server.typicode.com/MATPOK/PAW_LAB2_JSON/posts').then(r => r.json()),
      fetch('https://my-json-server.typicode.com/MATPOK/PAW_LAB2_JSON/comments').then(r => r.json())
    ])
      .then(([posts, comments]) => {
        setTimeout(() => {
          let html = "<ul>";

          posts.forEach(post => {
            const postComments = comments.filter(c => c.postId === post.id);

            html += `<li>
              <strong>${post.title}</strong><br>
                ${postComments.map(c => `<p>${c.body}</p>`).join("")}
            </li>`;
          });

          html += "</ul>";
          answer.innerHTML = html;
          loading.remove();
        }, 1000);
      })
      .catch(error => {
        answer.innerHTML = `<p style="color:red;">Błąd wczytywania danych: ${error}</p>`;
      });
  });

  cw2.addEventListener("click", function() {
    const id = document.getElementById("postId").value.trim();

    if (id === "") {
      answer.innerHTML = "<p style='color:red;'>Podaj ID posta!</p>";
      return;
    }

    const loading = LoadingPopup();

    Promise.all([
      fetch(`https://my-json-server.typicode.com/MATPOK/PAW_LAB2_JSON/posts/${id}`).then(r => {
        if (!r.ok) throw new Error("Post nie istnieje");
        return r.json();
      }),
      fetch('https://my-json-server.typicode.com/MATPOK/PAW_LAB2_JSON/comments').then(r => r.json())
    ])
      .then(([post, comments]) => {
        const postComments = comments.filter(c => c.postId === post.id);

        let html = `<h3>${post.title}</h3>`;
        if (postComments.length > 0) {
          html += "<ul>" + postComments.map(c => `<li>${c.body}</li>`).join("") + "</ul>";
        } else {
          html += "<p><em>Brak komentarzy</em></p>";
        }

        answer.innerHTML = html;
        loading.remove();
      })
      .catch(error => {
        answer.innerHTML = `<p style="color:red;">Błąd: ${error.message}</p>`;
      });
  });

  cw3.addEventListener("click", function() {
    answer.innerHTML = "<p><em>Processing...</em></p>";

    const newPost = {
      title: "Nowy post",
      body: "To jest przykładowa treść posta.",
      userId: 1
    };

    fetch("https://my-json-server.typicode.com/MATPOK/PAW_LAB2_JSON/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(data => {
        setTimeout(() => {
          answer.innerHTML = `<p>Dodano nowy post o ID = <strong>${data.id}</strong></p>`;
        }, 1000);
      })
      .catch(error => {
        answer.innerHTML = `<p style="color:red;">Błąd: ${error.message}</p>`;
      });
  });
})();
