document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'en';

    const translations = {
        en: {
            title: "Forge Your Legend",
            subtitle: "Enter your character details to generate an epic backstory",
            charNameLabel: "Character Name",
            charNamePlaceholder: "e.g. Eldor, Lirael",
            speciesLabel: "Species/Race",
            speciesPlaceholder: "e.g. Elf, Tiefling",
            backgroundLabel: "Background",
            backgroundPlaceholder: "e.g. Sage, Criminal, Noble",
            classesTitle: "Classes & Levels",
            classNamePlaceholder: "Class (e.g. Fighter)",
            classSubPlaceholder: "Subclass (Optional)",
            classLevelPlaceholder: "Lvl",
            addMulticlassBtn: "+ Add Multiclass",
            detailsTitle: "Character Details",
            themeLabel: "Backstory Theme",
            themePlaceholder: "e.g. Dark, Heroic, Tragic, Whimsical",
            traitsLabel: "Personality Traits",
            traitsPlaceholder: "e.g. Brave but reckless, loyal to a fault...",
            eventsLabel: "Important Events",
            eventsPlaceholder: "e.g. Betrayed by a friend, found a cursed artifact...",
            npcsTitle: "Important Characters (NPCs)",
            npcNamePlaceholder: "Name (e.g. Kaelen)",
            npcRolePlaceholder: "Role (e.g. Mentor, Rival)",
            addNpcBtn: "+ Add NPC",
            generateBtn: "Generate Backstory",
            resultTitle: "Your Tale",
            langBtn: "🇪🇸 ES"
        },
        es: {
            title: "Forja tu Leyenda",
            subtitle: "Ingresa los detalles de tu personaje para generar una historia épica",
            charNameLabel: "Nombre del Personaje",
            charNamePlaceholder: "ej. Eldor, Lirael",
            speciesLabel: "Especie/Raza",
            speciesPlaceholder: "ej. Elfo, Tiefling",
            backgroundLabel: "Trasfondo",
            backgroundPlaceholder: "ej. Sabio, Criminal, Noble",
            classesTitle: "Clases y Niveles",
            classNamePlaceholder: "Clase (ej. Guerrero)",
            classSubPlaceholder: "Subclase (Opcional)",
            classLevelPlaceholder: "Nvl",
            addMulticlassBtn: "+ Agregar Multiclase",
            detailsTitle: "Detalles del Personaje",
            themeLabel: "Tema de la Historia",
            themePlaceholder: "ej. Oscuro, Heroico, Trágico",
            traitsLabel: "Rasgos de Personalidad",
            traitsPlaceholder: "ej. Valiente pero imprudente, leal...",
            eventsLabel: "Eventos Importantes",
            eventsPlaceholder: "ej. Traicionado por un amigo...",
            npcsTitle: "Personajes Importantes (NPCs)",
            npcNamePlaceholder: "Nombre (ej. Kaelen)",
            npcRolePlaceholder: "Rol (ej. Mentor, Rival)",
            addNpcBtn: "+ Agregar NPC",
            generateBtn: "Generar Historia",
            resultTitle: "Tu Relato",
            langBtn: "🇺🇸 EN"
        }
    };

    const langToggleBtn = document.getElementById('lang-toggle');

    function updateLanguage() {
        const t = translations[currentLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.textContent = t[key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) el.setAttribute('placeholder', t[key]);
        });
        langToggleBtn.textContent = t.langBtn;
        document.documentElement.lang = currentLang;
    }

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        updateLanguage();
    });
    const classList = document.getElementById('classes-list');
    const addClassBtn = document.getElementById('add-class-btn');
    const form = document.getElementById('backstory-form');
    const generateBtn = document.getElementById('generate-btn');
    const btnText = generateBtn.querySelector('.btn-text');
    const loader = generateBtn.querySelector('.loader');
    const resultSection = document.getElementById('result-section');
    const backstoryContent = document.getElementById('backstory-content');
    const copyBtn = document.getElementById('copy-btn');

    // Handle adding new class rows
    addClassBtn.addEventListener('click', () => {
        const rows = classList.querySelectorAll('.class-row');
        showAllRemoveButtons();

        const newRow = document.createElement('div');
        newRow.className = 'class-row';
        const t = translations[currentLang];
        newRow.innerHTML = `
            <input type="text" class="class-name" placeholder="${t.classNamePlaceholder}" required>
            <input type="text" class="class-subclass" placeholder="${t.classSubPlaceholder}">
            <input type="number" class="class-level" placeholder="${t.classLevelPlaceholder}" min="1" max="20" required>
            <button type="button" class="remove-btn">✕</button>
        `;

        classList.appendChild(newRow);

        newRow.querySelector('.remove-btn').addEventListener('click', () => {
            newRow.remove();
            updateRemoveButtons();
        });
    });

    // Update visibility of remove buttons
    function updateRemoveButtons() {
        const rows = classList.querySelectorAll('.class-row');
        if (rows.length === 1) {
            const btn = rows[0].querySelector('.remove-btn');
            btn.classList.add('invisible');
            btn.disabled = true;
        } else {
            showAllRemoveButtons();
        }
    }

    function showAllRemoveButtons() {
        const rows = classList.querySelectorAll('.class-row');
        rows.forEach(row => {
            const btn = row.querySelector('.remove-btn');
            if(btn) {
                btn.classList.remove('invisible');
                btn.disabled = false;
            }
        });
    }

    // Attach event listener to initial remove button
    const initialRemoveBtn = classList.querySelector('.remove-btn');
    if (initialRemoveBtn) {
        initialRemoveBtn.addEventListener('click', function() {
            if (classList.querySelectorAll('.class-row').length > 1) {
                this.parentElement.remove();
                updateRemoveButtons();
            }
        });
    }

    const npcList = document.getElementById('npcs-list');
    const addNpcBtn = document.getElementById('add-npc-btn');

    // Handle adding new NPC rows
    addNpcBtn.addEventListener('click', () => {
        showAllNpcRemoveButtons();

        const newRow = document.createElement('div');
        newRow.className = 'npc-row';
        const t = translations[currentLang];
        newRow.innerHTML = `
            <input type="text" class="npc-name" placeholder="${t.npcNamePlaceholder}">
            <input type="text" class="npc-role" placeholder="${t.npcRolePlaceholder}">
            <button type="button" class="remove-npc-btn">✕</button>
        `;
        npcList.appendChild(newRow);

        newRow.querySelector('.remove-npc-btn').addEventListener('click', () => {
            newRow.remove();
            updateNpcRemoveButtons();
        });
    });

    function updateNpcRemoveButtons() {
        const rows = npcList.querySelectorAll('.npc-row');
        if (rows.length === 1) {
            const btn = rows[0].querySelector('.remove-npc-btn');
            btn.classList.add('invisible');
            btn.disabled = true;
        } else {
            showAllNpcRemoveButtons();
        }
    }

    function showAllNpcRemoveButtons() {
        const rows = npcList.querySelectorAll('.npc-row');
        rows.forEach(row => {
            const btn = row.querySelector('.remove-npc-btn');
            if(btn) {
                btn.classList.remove('invisible');
                btn.disabled = false;
            }
        });
    }

    // Attach event listener to initial npc remove button
    const initialNpcRemoveBtn = npcList.querySelector('.remove-npc-btn');
    if (initialNpcRemoveBtn) {
        initialNpcRemoveBtn.addEventListener('click', function() {
            if (npcList.querySelectorAll('.npc-row').length > 1) {
                this.parentElement.remove();
                updateNpcRemoveButtons();
            }
        });
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather basic data
        const name = document.getElementById('name').value.trim();
        const species = document.getElementById('species').value.trim();
        const background = document.getElementById('background').value.trim();
        
        // Gather advanced data
        const theme = document.getElementById('theme').value.trim();
        const traits = document.getElementById('traits').value.trim();
        const events = document.getElementById('events').value.trim();
        
        const classes = [];
        document.querySelectorAll('.class-row').forEach(row => {
            const cName = row.querySelector('.class-name').value.trim();
            const cSubclass = row.querySelector('.class-subclass').value.trim();
            const cLevel = row.querySelector('.class-level').value.trim();
            if (cName && cLevel) {
                classes.push({ name: cName, subclass: cSubclass, level: cLevel });
            }
        });

        const npcs = [];
        document.querySelectorAll('.npc-row').forEach(row => {
            const nName = row.querySelector('.npc-name').value.trim();
            const nRole = row.querySelector('.npc-role').value.trim();
            if (nName && nRole) {
                npcs.push({ name: nName, role: nRole });
            }
        });

        const payload = { 
            name, species, background, theme, traits, events, classes, npcs,
            language: currentLang 
        };

        // UI Updates for loading
        setLoadingState(true);
        resultSection.classList.add('hidden');
        backstoryContent.innerHTML = '';

        try {
            const response = await fetch('/api/generate-backstory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate backstory');
            }

            resultSection.classList.remove('hidden');
            typeWriter(data.backstory, backstoryContent, 20); // 20ms per character

        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoadingState(false);
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const text = backstoryContent.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const originalTitle = copyBtn.title;
            copyBtn.title = "Copied!";
            copyBtn.textContent = "✅";
            setTimeout(() => {
                copyBtn.title = originalTitle;
                copyBtn.textContent = "📋";
            }, 2000);
        });
    });

    function setLoadingState(isLoading) {
        if (isLoading) {
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
            generateBtn.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }

    // Typewriter effect function
    function typeWriter(text, element, speed = 30) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
});
