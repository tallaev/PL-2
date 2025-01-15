// Генерация случайного пароля
function generatePassword(length = 12) {
    if (length < 6) {
        throw new Error("Password length must be at least 6 characters.");
    }
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

// Класс для управления паролями
class PasswordManager {
    constructor() {
        this.passwords = JSON.parse(localStorage.getItem('passwords')) || {};
    }

    saveToLocalStorage() {
        localStorage.setItem('passwords', JSON.stringify(this.passwords));
    }

    addEntry(service, login, password = null) {
        if (this.passwords[service]) {
            console.log(`Entry for service '${service}' already exists.`);
            return;
        }
        if (!password) {
            password = generatePassword();
        }
        this.passwords[service] = { login, password };
        this.saveToLocalStorage();
        console.log(`Entry for service '${service}' added.`);
    }

    viewEntry(service) {
        const entry = this.passwords[service];
        if (!entry) {
            console.log(`No entry found for service '${service}'.`);
            return;
        }
        console.log(`Service: ${service}`);
        console.log(`Login: ${entry.login}`);
        console.log(`Password: ${entry.password}`);
    }

    listServices() {
        return Object.entries(this.passwords).map(([service, { login, password }]) => ({ service, login, password }));
    }
}

// Пример использования
const manager = new PasswordManager();

document.addEventListener('DOMContentLoaded', () => {
    const serviceInput = document.getElementById('service');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const generateButton = document.getElementById('generate');
    const saveButton = document.getElementById('save');
    const servicesList = document.getElementById('services-list');

    function updateServiceList() {
        servicesList.innerHTML = '';
        const services = manager.listServices();
        services.forEach(({ service, login, password }) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Service:</strong> ${service}<br>
                <strong>Login:</strong> ${login}<br>
                <strong>Password:</strong> <span class="password">${password}</span>
                <button class="copy-button" data-password="${password}">Copy</button>
            `;

            servicesList.appendChild(li);
        });

        document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const password = event.target.getAttribute('data-password');
                navigator.clipboard.writeText(password).then(() => {
                    alert('Password copied to clipboard!');
                }).catch(() => {
                    alert('Failed to copy password.');
                });
            });
        });
    }

    generateButton.addEventListener('click', () => {
        passwordInput.value = generatePassword();
    });

    saveButton.addEventListener('click', () => {
        const service = serviceInput.value.trim();
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        if (!service || !login) {
            alert('Service and login are required.');
            return;
        }

        manager.addEntry(service, login, password);
        updateServiceList();

        serviceInput.value = '';
        loginInput.value = '';
        passwordInput.value = '';
    });

    updateServiceList();
});