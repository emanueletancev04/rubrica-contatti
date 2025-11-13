document.addEventListener("DOMContentLoaded", () => {
  const contactsList = document.getElementById("contacts-list");
  const apiUrl = "https://jsonplaceholder.typicode.com/users";

  const fetchAndDisplayUsers = async () => {
    try {
      const localUsers = localStorage.getItem("users");
      if (localUsers) {
        console.log("Dati caricati dal localStorage.");
        displayUsers(JSON.parse(localUsers));
      } else {
        console.log("Chiamata all'API in corso...");
        const response = await fetch(apiUrl);
        if (!response.ok)
          throw new Error(`Errore HTTP! Stato: ${response.status}`);
        const users = await response.json();
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Dati salvati nel localStorage.");
        displayUsers(users);
      }
    } catch (error) {
      console.error("Impossibile recuperare i contatti:", error);
      contactsList.innerHTML =
        '<tr><td colspan="3">Errore nel caricamento dei dati.</td></tr>';
    }
  };

  const displayUsers = (users) => {
    contactsList.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.dataset.userId = user.id;
      row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <a href="form.html?id=${user.id}">Modifica</a>
                    <a href="#" class="delete-btn" data-id="${user.id}">Elimina</a>
                </td>
            `;
      contactsList.appendChild(row);
    });
  };

  const deleteUser = async (userId, buttonElement) => {
    if (!confirm("Sei sicuro di voler eliminare questo contatto?")) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Errore durante l'eliminazione. Stato: ${response.status}`
        );
      }

      console.log(
        `Utente con ID ${userId} eliminato con successo (simulato dall'API).`
      );

      let users = JSON.parse(localStorage.getItem("users")) || [];
      users = users.filter((user) => user.id != userId);
      localStorage.setItem("users", JSON.stringify(users));

      const rowToRemove = buttonElement.closest("tr");
      rowToRemove.remove();

      alert("Contatto eliminato con successo!");
    } catch (error) {
      console.error("Errore nell'eliminazione:", error);
      alert("Si è verificato un errore durante l'eliminazione.");
    }
  };

  contactsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      event.preventDefault();
      const userId = event.target.dataset.id;
      deleteUser(userId, event.target);
    }
  });

  fetchAndDisplayUsers();
});
