document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const formTitle = document.getElementById("form-title");
  const apiUrl = "https://jsonplaceholder.typicode.com/users";

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");
  const isEditMode = userId !== null;

  const initializeEditForm = async () => {
    if (isEditMode) {
      formTitle.textContent = "Modifica Contatto";
      try {
        const response = await fetch(`${apiUrl}/${userId}`);
        if (!response.ok) throw new Error("Utente non trovato");
        const user = await response.json();

        nameInput.value = user.name;
        emailInput.value = user.email;
      } catch (error) {
        console.error("Errore nel caricamento dei dati utente:", error);
        alert(
          "Impossibile caricare i dati del contatto. Verrai reindirizzato."
        );
        window.location.href = "index.html";
      }
    }
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const contactData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
    };

    if (isEditMode) {
      try {
        const response = await fetch(`${apiUrl}/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData),
        });

        if (!response.ok) throw new Error("Errore durante l'aggiornamento");

        const updatedUser = await response.json();
        console.log("Utente aggiornato (simulato):", updatedUser);

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex((user) => user.id == userId);
        if (userIndex !== -1) {
          users[userIndex] = {
            ...users[userIndex],
            ...updatedUser,
            id: parseInt(userId),
          };
        }
        localStorage.setItem("users", JSON.stringify(users));

        alert("Contatto aggiornato con successo!");
        window.location.href = "index.html";
      } catch (error) {
        console.error("Errore nell'aggiornamento:", error);
        alert("Si è verificato un errore durante l'aggiornamento.");
      }
    } else {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData),
        });

        if (!response.ok) throw new Error("Errore durante la creazione");

        const createdUser = await response.json();
        console.log("Utente creato (simulato):", createdUser);

        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push(createdUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Contatto aggiunto con successo!");
        window.location.href = "index.html";
      } catch (error) {
        console.error("Errore nella creazione:", error);
        alert("Si è verificato un errore durante la creazione.");
      }
    }
  });

  initializeEditForm();
});
