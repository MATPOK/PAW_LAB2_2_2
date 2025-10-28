  (function () {
    const example = document.getElementById('example');
    const cw1 = document.getElementById('cw1');
    const cw2 = document.getElementById('cw2');
    const cw3 = document.getElementById('cw3');
    const answer = document.getElementById('answer');

    example.addEventListener("click", function () {
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(array => {
          console.log(array);
          answer.innerHTML = JSON.stringify(array);
        });
    });

    cw1.addEventListener("click", function () {
      answer.innerHTML = "<p><em>Loading...</em></p>";

      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(array => {
          setTimeout(() => {
            let html = "<ul>";
            array.forEach(post => {
              html += `<li><strong>${post.title}</strong><br>${post.body}</li>`;
            });
            html += "</ul>";
            answer.innerHTML = html;
          }, 1000);
        })
        .catch(error => {
          answer.innerHTML = `<p style="color:red;">Błąd wczytywania danych: ${error}</p>`;
        });
    });

    cw2.addEventListener("click", function () {
      const id = document.getElementById("postId").value.trim();

      if (id === "") {
        answer.innerHTML = "<p style='color:red;'>Podaj ID posta!</p>";
        return;
      }

      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then(response => {
          if (!response.ok) throw new Error("Post nie istnieje");
          return response.json();
        })
        .then(post => {
          console.log(post);
          console.log(post.title);
          console.log(post.body);
          let html = `<li><strong>${post.title}</strong><br>${post.body}</li>`;
          answer.innerHTML = html;
        })
        .catch(error => {
          answer.innerHTML = `<p style="color:red;">Błąd: ${error.message}</p>`;
        });
    });

    cw3.addEventListener("click", function () {
      answer.innerHTML = "<p><em>Processing...</em></p>";

      const newPost = {
        title: "Nowy post",
        body: "To jest przykładowa treść posta.",
        userId: 1
      };

      fetch("https://jsonplaceholder.typicode.com/posts", {
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
