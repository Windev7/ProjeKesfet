// Basit kullanıcı sistemi (localStorage tabanlı)
// Moderatör hesabı: EmirSeyfOS

const MOD_USERNAME = "EmirSeyfOS";

const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const currentUserLabel = document.getElementById("currentUser");
const moderatorPanel = document.getElementById("moderatorPanel");
const modName = document.getElementById("modName");

const projectForm = document.getElementById("projectForm");
const projectsList = document.getElementById("projectsList");

let currentUser = null;
let users = {};
let projects = [];

// Sayfa açıldığında verileri yükle
window.addEventListener("DOMContentLoaded", () => {
    const savedUsers = localStorage.getItem("pk_users");
    if (savedUsers) users = JSON.parse(savedUsers);

    const savedUser = localStorage.getItem("pk_currentUser");
    if (savedUser) setUser(savedUser);

    const savedProjects = localStorage.getItem("pk_projects");
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    } else {
        projects = [
            {
                name: "ProjeKeşfet Tanıtım",
                url: "https://scratch.mit.edu/projects/000000000",
                description: "Bu, ProjeKeşfet platformu için örnek bir tanıtım projesi.",
                author: "Sistem"
            }
        ];
        saveProjects();
    }

    renderProjects();
});

// Kullanıcı kaydı
registerBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Kullanıcı adı ve şifre boş olamaz.");
        return;
    }

    if (users[username]) {
        alert("Bu kullanıcı adı zaten kayıtlı.");
        return;
    }

    users[username] = { password };
    saveUsers();

    alert("Kayıt başarılı! Artık giriş yapabilirsin.");
});

// Giriş
loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Kullanıcı adı ve şifre gir.");
        return;
    }

    if (!users[username]) {
        alert("Böyle bir kullanıcı yok. Önce kayıt ol.");
        return;
    }

    if (users[username].password !== password) {
        alert("Şifre yanlış.");
        return;
    }

    setUser(username);
});

// Kullanıcı ayarla
function setUser(username) {
    currentUser = username;
    currentUserLabel.textContent = `Giriş yapıldı: ${username}`;
    usernameInput.value = "";
    passwordInput.value = "";

    checkModerator();
    localStorage.setItem("pk_currentUser", username);
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

// Kullanıcıları kaydet
function saveUsers() {
    localStorage.setItem("pk_users", JSON.stringify(users));
}

// Proje gönderme
projectForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentUser) {
        alert("Proje paylaşmak için giriş yapmalısın.");
        return;
    }

    const name = document.getElementById("projectName").value.trim();
    const url = document.getElementById("projectUrl").value.trim();
    const description = document.getElementById("projectDescription").value.trim();

    if (!name || !url || !description) {
        alert("Tüm alanları doldur.");
        return;
    }

    const newProject = {
        name,
        url,
        description,
        author: currentUser
    };

    projects.unshift(newProject);
    saveProjects();
    renderProjects();
    projectForm.reset();
});

// Projeleri kaydet
function saveProjects() {
    localStorage.setItem("pk_projects", JSON.stringify(projects));
}

// Projeleri listele
function renderProjects() {
    projectsList.innerHTML = "";

    if (projects.length === 0) {
        projectsList.innerHTML = "<p>Henüz proje yok.</p>";
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
       // Scratch URL → TurboWarp Player URL
const projectId = project.url.split("/projects/")[1].replace("/", "");
a.href = `https://turbowarp.org/${projectId}/embed`;

        link.appendChild(a);

        card.appendChild(header);
        card.appendChild(desc);
        card.appendChild(link);

        // Moderatör silme butonu
        if (currentUser === MOD_USERNAME) {
            const del = document.createElement("button");
            del.textContent = "Sil (Mod)";
            del.style.marginTop = "6px";
            del.style.background = "#dc2626";
            del.style.color = "white";
            del.style.border = "none";
            del.style.padding = "4px 8px";
            del.style.borderRadius = "4px";
            del.style.cursor = "pointer";

            del.addEventListener("click", () => {
                if (confirm("Bu projeyi silmek istiyor musun?")) {
                    projects.splice(index, 1);
                    saveProjects();
                    renderProjects();
                }
            });

            card.appendChild(del);
        }

        projectsList.appendChild(card);
    });
}
