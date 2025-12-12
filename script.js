// Basit, localStorage tabanlı proje ve "giriş" sistemi

const MOD_USERNAME = "EmirSeyfOS";

const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");
const currentUserLabel = document.getElementById("currentUser");
const moderatorPanel = document.getElementById("moderatorPanel");
const modName = document.getElementById("modName");

const projectForm = document.getElementById("projectForm");
const projectsList = document.getElementById("projectsList");

let currentUser = null;
let projects = [];

// Sayfa açıldığında localStorage'dan verileri yükle
window.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("pk_currentUser");
    if (savedUser) {
        setUser(savedUser);
    }
    const savedProjects = localStorage.getItem("pk_projects");
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
        renderProjects();
    } else {
        // Demo amaçlı 1-2 örnek proje
        projects = [
            {
                name: "ProjeKeşfet Tanıtım",
                url: "https://scratch.mit.edu/projects/000000000",
                description: "Bu, ProjeKeşfet platformu için örnek bir tanıtım projesi.",
                author: "Sistem"
            }
        ];
        saveProjects();
        renderProjects();
    }
});

// Kullanıcı ayarla
function setUser(username) {
    currentUser = username;
    currentUserLabel.textContent = username ? `Giriş yapıldı: ${username}` : "";
    usernameInput.value = "";
    checkModerator();
    localStorage.setItem("pk_currentUser", username || "");
}

// Moderatör kontrolü
function checkModerator() {
    if (currentUser === MOD_USERNAME) {
        moderatorPanel.style.display = "block";
        modName.textContent = currentUser;
    } else {
        moderatorPanel.style.display = "none";
        modName.textContent = "";
    }
}

// Giriş butonu
loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (!username) {
        alert("Kullanıcı adı boş olamaz.");
        return;
    }
    setUser(username);
});

// Proje formu gönderme
projectForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("projectName").value.trim();
    const url = document.getElementById("projectUrl").value.trim();
    const description = document.getElementById("projectDescription").value.trim();

    if (!currentUser) {
        alert("Proje paylaşmak için önce kullanıcı adıyla giriş yap.");
        return;
    }

    if (!name || !url || !description) {
        alert("Lütfen tüm alanları doldur.");
        return;
    }

    const newProject = {
        name,
        url,
        description,
        author: currentUser
    };

    projects.unshift(newProject); // en yeni en üste
    saveProjects();
    renderProjects();
    projectForm.reset();
});

// Projeleri kaydet ve göster
function saveProjects() {
    localStorage.setItem("pk_projects", JSON.stringify(projects));
}

function renderProjects() {
    projectsList.innerHTML = "";
    if (projects.length === 0) {
        projectsList.innerHTML = "<p>Henüz proje yok. İlk projeyi sen paylaş!</p>";
        return;
    }

    projects.forEach((project, index) => {
        const card = document.createElement("div");
        card.className = "project-card";

        const header = document.createElement("div");
        header.className = "project-card-header";

        const title = document.createElement("div");
        title.className = "project-title";
        title.textContent = project.name;

        const user = document.createElement("div");
        user.className = "project-user";
        user.textContent = `Paylaşan: ${project.author}`;

        header.appendChild(title);
        header.appendChild(user);

        const desc = document.createElement("div");
        desc.className = "project-desc";
        desc.textContent = project.description;

        const link = document.createElement("div");
        link.className = "project-link";
        const a = document.createElement("a");
        a.href = project.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "Projeye git";
        link.appendChild(a);

        card.appendChild(header);
        card.appendChild(desc);
        card.appendChild(link);

        // Basit "moderatör" özelliği: sadece EmirSeyfOS projeyi silebilir
        if (currentUser === MOD_USERNAME) {
            const modControls = document.createElement("div");
            modControls.style.marginTop = "6px";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Projeyi Sil (Mod)";
            deleteBtn.style.fontSize = "0.75rem";
            deleteBtn.style.padding = "4px 8px";
            deleteBtn.style.borderRadius = "4px";
            deleteBtn.style.border = "none";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.background = "#dc2626";
            deleteBtn.style.color = "#fee2e2";

            deleteBtn.addEventListener("click", () => {
                if (confirm(`"${project.name}" projesini silmek istediğine emin misin?`)) {
                    projects.splice(index, 1);
                    saveProjects();
                    renderProjects();
                }
            });

            modControls.appendChild(deleteBtn);
            card.appendChild(modControls);
        }

        projectsList.appendChild(card);
    });
}
