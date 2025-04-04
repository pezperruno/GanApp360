// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase or your preferred backend service
    // For demo purposes we'll use localStorage
    
    // Elements
    const loginContainer = document.getElementById('loginContainer');
    const appContainer = document.getElementById('appContainer');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');
    
    // Add user profile to sidebar
    const sidebar = document.querySelector('.sidebar');
    const userProfileHeader = document.createElement('div');
    userProfileHeader.className = 'user-profile-header';
    userProfileHeader.innerHTML = `
        <div class="user-profile-pic">
            <span id="userInitials">U</span>
        </div>
        <div class="user-profile-info">
            <div class="user-profile-name" id="userDisplayName">Usuario</div>
            <div class="user-profile-email" id="userDisplayEmail">usuario@ejemplo.com</div>
        </div>
        <button class="logout-btn" id="logoutButton">
            <i class="fas fa-sign-out-alt"></i>
        </button>
    `;
    sidebar.insertBefore(userProfileHeader, sidebar.firstChild);
    
    // Check if user is logged in
    function checkLoginStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            // Update user profile display
            document.getElementById('userDisplayName').textContent = currentUser.name;
            document.getElementById('userDisplayEmail').textContent = currentUser.email;
            document.getElementById('userInitials').textContent = getInitials(currentUser.name);
            
            // Also update user info in settings
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            if (userName) userName.value = currentUser.name;
            if (userEmail) userEmail.value = currentUser.email;
            
            // Show app, hide login
            loginContainer.style.display = 'none';
            appContainer.style.display = 'flex';
        } else {
            // Show login, hide app
            loginContainer.style.display = 'flex';
            appContainer.style.display = 'none';
            // Reset forms
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            loginError.textContent = '';
        }
    }
    
    // Get user initials for profile pic
    function getInitials(name) {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    
    // Toggle between login and register forms
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    // Handle login
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                loginError.textContent = 'Por favor, complete todos los campos';
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Store current user
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }));
                
                // Check login status to update UI
                checkLoginStatus();
            } else {
                loginError.textContent = 'Credenciales inválidas';
            }
        });
    }
    
    // Handle register
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validate fields
            if (!name || !email || !password || !confirmPassword) {
                registerError.textContent = 'Por favor, complete todos los campos';
                return;
            }
            
            if (password !== confirmPassword) {
                registerError.textContent = 'Las contraseñas no coinciden';
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                registerError.textContent = 'Correo electrónico inválido';
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                registerError.textContent = 'Este correo electrónico ya está registrado';
                return;
            }
            
            // Add new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password // In a real app, you should hash this
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Store current user
            localStorage.setItem('currentUser', JSON.stringify({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }));
            
            // Check login status to update UI
            checkLoginStatus();
        });
    }
    
    // Handle logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            checkLoginStatus();
        });
    }
    
    // Initial check on page load
    checkLoginStatus();
    
    // Navegación entre secciones
    const navItems = document.querySelectorAll('.sidebar nav ul li');
    const sections = document.querySelectorAll('.section-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Agregar clase active al item seleccionado
            this.classList.add('active');
            
            // Ocultar todas las secciones
            sections.forEach(section => section.classList.remove('active'));
            
            // Mostrar la sección correspondiente
            const sectionId = this.getAttribute('data-section');
            const sectionElement = document.getElementById(sectionId);
            if (sectionElement) {
                sectionElement.classList.add('active');
                
                // Inicializar secciones específicas
                if (sectionId === 'animals') {
                    // No specific initialization needed for animals section yet
                    loadFincasInSelectors();
                } else if (sectionId === 'feeding') {
                    // Inicializar la sección de alimentación
                    initFeedingSection();
                } else if (sectionId === 'tasks') {
                    initTasksSection();
                } else if (sectionId === 'inventory') {
                    initInventory();
                } else if (sectionId === 'settings') {
                    initSettingsSection();
                } else if (sectionId === 'activities') {
                    initActivitiesSection();
                } else if (sectionId === 'reports') {
                    loadSavedFiles();
                }
                
                // Actualizar home si corresponde
                if (sectionId === 'home') {
                    updateHomeStats();
                    loadRecentActivity();
                }
            }
        });
    });

    // Accesos rápidos en la página de inicio
    const quickAccessItems = document.querySelectorAll('.quick-access-item');
    if (quickAccessItems.length > 0) {
        quickAccessItems.forEach(item => {
            item.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                // Buscar el elemento nav correspondiente y simulamos un clic
                const navItem = document.querySelector(`.sidebar nav ul li[data-section="${sectionId}"]`);
                if (navItem) {
                    navItem.click();
                }
            });
        });
    }
    
    // Botón para ir a configuración
    const goToSettingsBtn = document.getElementById('goToSettingsBtn');
    if (goToSettingsBtn) {
        goToSettingsBtn.addEventListener('click', function() {
            const settingsNavItem = document.querySelector('.sidebar nav ul li[data-section="settings"]');
            if (settingsNavItem) {
                settingsNavItem.click();
            }
        });
    }
    
    // Función para actualizar estadísticas en la página de inicio
    function updateHomeStats() {
        // Count animals from localStorage rather than counting DOM elements
        const animals = JSON.parse(localStorage.getItem('animals') || '[]');
        document.getElementById('animalCount').textContent = animals.length;
        
        // Get farm count from localStorage
        const fincas = JSON.parse(localStorage.getItem('fincas') || '[]');
        document.getElementById('fincaCount').textContent = fincas.length;
        
        // Mostrar balance financiero
        const totalBalance = document.getElementById('totalBalance')?.textContent || '€0.00';
        document.getElementById('quickBalance').textContent = totalBalance;
    }
    
    // Función para cargar actividad reciente
    function loadRecentActivity() {
        const activityList = document.getElementById('recentActivityList');
        if (!activityList) return;
        
        // Limpiar lista actual
        activityList.innerHTML = '';
        
        // Obtener actualizaciones recientes de contenido
        const contentUpdates = JSON.parse(localStorage.getItem('recentContentUpdates') || '[]');
        
        // Combinar todas las actividades
        let allActivities = [];
        
        // Añadir actualizaciones de contenido
        contentUpdates.forEach(update => {
            allActivities.push({
                type: 'content',
                title: `Sección ${update.sectionName}`,
                details: 'Contenido actualizado',
                icon: 'fas fa-edit',
                date: new Date(update.timestamp),
                timestamp: update.timestamp
            });
        });
        
        // Ordenar por fecha (más reciente primero)
        allActivities.sort((a, b) => b.date - a.date);
        
        // Mostrar solo las 5 actividades más recientes
        const recentActivities = allActivities.slice(0, 5);
        
        if (recentActivities.length === 0) {
            activityList.innerHTML = '<li class="empty-list-message">No hay actividad reciente</li>';
            return;
        }
        
        // Añadir a la lista
        recentActivities.forEach(activity => {
            const activityItem = document.createElement('li');
            activityItem.className = 'activity-item';
            
            const date = new Date(activity.date);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-info">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-details">${activity.details}</div>
                </div>
                <div class="activity-timestamp">${formattedDate}</div>
            `;
            
            activityList.appendChild(activityItem);
        });
    }
    
    // Inicializar estadísticas y actividad reciente si la página de inicio está activa al cargar
    const homePage = document.getElementById('home');
    if (homePage && homePage.classList.contains('active')) {
        updateHomeStats();
        loadRecentActivity();
    }

    // Modal de Animales
    const addAnimalBtn = document.getElementById('addAnimalBtn');
    const animalModal = document.getElementById('animalModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelAnimalBtn = document.getElementById('cancelAnimal');
    
    // Modal de Registro de Nacimiento
    const registerBirthBtn = document.getElementById('registerBirthBtn');
    const birthRegistrationModal = document.getElementById('birthRegistrationModal');
    const closeBirthModal = document.querySelector('.close-birth-modal');
    const cancelBirthBtn = document.getElementById('cancelBirth');
    
    // Selector de fincas
    const farmSelector = document.getElementById('fincaSelector');
    if (farmSelector) {
        // Limpiar opciones del selector
        farmSelector.innerHTML = '';
        
        // En una implementación real, aquí cargaríamos las fincas desde la base de datos
        // Por ahora, dejamos el selector vacío para que se llene con las fincas que el usuario agregue
        
        farmSelector.addEventListener('change', function() {
            // Cambiar la finca activa
            const selectedFinca = this.value;
            document.getElementById('currentFincaName').textContent = this.options[this.selectedIndex].text;
            // En una implementación real, aquí cargaríamos los datos de la finca seleccionada
            console.log('Finca seleccionada:', selectedFinca);
            
            // Actualizamos visualmente a qué finca pertenece cada animal
            updateAnimalFarmLabels(this.options[this.selectedIndex].text);
        });
        
        // Inicializar con el nombre de la primera finca seleccionada si hay opciones
        if (farmSelector.options.length > 0) {
            document.getElementById('currentFincaName').textContent = farmSelector.options[farmSelector.selectedIndex].text;
        } else {
            document.getElementById('currentFincaName').textContent = "Sin fincas";
        }
    }
    
    // Abrir modal
    if (addAnimalBtn) {
        addAnimalBtn.addEventListener('click', function() {
            animalModal.style.display = 'block';
        });
    }
    
    // Cerrar modal con 'x'
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            animalModal.style.display = 'none';
        });
    }
    
    // Cerrar modal con botón cancelar
    if (cancelAnimalBtn) {
        cancelAnimalBtn.addEventListener('click', function() {
            animalModal.style.display = 'none';
        });
    }
    
    // Cerrar modal haciendo clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === animalModal) {
            animalModal.style.display = 'none';
        }
    });
    
    // Abrir modal de registro de nacimiento
    if (registerBirthBtn) {
        registerBirthBtn.addEventListener('click', function() {
            birthRegistrationModal.style.display = 'block';
        });
    }
    
    // Cerrar modal de registro de nacimiento con 'x'
    if (closeBirthModal) {
        closeBirthModal.addEventListener('click', function() {
            birthRegistrationModal.style.display = 'none';
        });
    }
    
    // Cerrar modal de registro de nacimiento con botón cancelar
    if (cancelBirthBtn) {
        cancelBirthBtn.addEventListener('click', function() {
            birthRegistrationModal.style.display = 'none';
        });
    }
    
    // Cerrar modal de registro de nacimiento haciendo clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === birthRegistrationModal) {
            birthRegistrationModal.style.display = 'none';
        }
    });
    
    // Tabs dentro del formulario de animales
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover active de todos los botones
            tabBtns.forEach(button => button.classList.remove('active'));
            // Agregar active al botón seleccionado
            this.classList.add('active');
            
            // Ocultar todos los contenidos
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Mostrar el contenido correspondiente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Añadir vacunación
    const addVacBtn = document.getElementById('addVaccination');
    const vacsList = document.getElementById('vaccinationsList');
    
    if (addVacBtn && vacsList) {
        addVacBtn.addEventListener('click', function() {
            const vacItem = document.createElement('div');
            vacItem.className = 'vac-item';
            vacItem.innerHTML = `
                <input type="date">
                <input type="text" placeholder="Tipo de vacuna">
                <button type="button" class="btn-icon remove-vac">
                    <i class="fas fa-times"></i>
                </button>
            `;
            vacsList.appendChild(vacItem);
            
            // Evento para eliminar vacunación
            const removeBtn = vacItem.querySelector('.remove-vac');
            removeBtn.addEventListener('click', function() {
                vacsList.removeChild(vacItem);
            });
        });
    }
    
    // Manejar tipo de producción
    const productionType = document.getElementById('productionType');
    const milkFields = document.getElementById('milkProductionFields');
    
    if (productionType && milkFields) {
        productionType.addEventListener('change', function() {
            if (this.value === 'milk') {
                milkFields.style.display = 'block';
            } else {
                milkFields.style.display = 'none';
            }
        });
    }
    
    // Inicializar el gráfico de producción en el dashboard
    function initProductionChart() {
        // Esta función ya no es necesaria ya que se eliminó el dashboard
        // Pero dejamos el stub para evitar errores en llamadas existentes
    }
    
    // Formularios
    const userProfileForm = document.getElementById('userProfileForm');
    const farmProfileForm = document.getElementById('farmProfileForm');
    const animalForm = document.getElementById('animalForm');
    const birthRegistrationForm = document.getElementById('birthRegistrationForm');
    
    // Manejar envío del formulario de perfil de usuario
    if (userProfileForm) {
        userProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí iría la lógica para guardar los datos del perfil
            alert('Datos de perfil guardados correctamente');
        });
    }
    
    // Manejar envío del formulario de perfil de finca
    if (farmProfileForm) {
        farmProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí iría la lógica para guardar los datos de la finca
            alert('Datos de la finca guardados correctamente');
        });
    }
    
    // Manejar envío del formulario de animales
    if (animalForm) {
        animalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los datos del formulario
            const animalId = document.getElementById('animalId').value;
            const breed = document.getElementById('breed').value;
            const category = document.getElementById('animalCategory').value;
            const sex = document.getElementById('animalSex').value;
            const age = document.getElementById('age').value;
            const weight = document.getElementById('weight').value;
            const finca = document.getElementById('animalFinca').value;
            
            // Datos de nacimiento
            const birthDate = document.getElementById('birthDate')?.value || '';
            const motherCrotal = document.getElementById('motherCrotal')?.value || '';
            const birthWeight = document.getElementById('birthWeight')?.value || '';
            const birthCondition = document.getElementById('birthCondition')?.value || '';
            const birthNotes = document.getElementById('birthNotes')?.value || '';
                    
            // Verificar si estamos en modo edición
            const isEditMode = this.getAttribute('data-edit-mode') === 'true';
            const cardId = this.getAttribute('data-card-id');
            
            // Create animal object
            const animalData = {
                id: isEditMode ? cardId : 'animal-' + Date.now(),
                animalId,
                breed,
                category,
                sex,
                age,
                weight,
                finca,
                birthDate,
                motherCrotal,
                birthWeight,
                birthCondition,
                birthNotes,
                type: 'regular',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Get existing animals from localStorage
            let animals = JSON.parse(localStorage.getItem('animals') || '[]');

            if (isEditMode) {
                // Update existing animal
                const index = animals.findIndex(a => a.id === cardId);
                if (index !== -1) {
                    animals[index] = {...animals[index], ...animalData, updatedAt: new Date().toISOString()};
                }
            } else {
                // Add new animal
                animals.push(animalData);
            }

            // Save to localStorage
            localStorage.setItem('animals', JSON.stringify(animals));

            // Update UI
            if (isEditMode) {
                updateAnimalCard(animalData);
            } else {
                addAnimalToGrid(animalData);
            }

            // Reset form and close modal
            this.reset();
            this.removeAttribute('data-edit-mode');
            this.removeAttribute('data-card-id');
            animalModal.style.display = 'none';
            
            // Update statistics and records
            updateHomeStats();
            updateAllRecordsTab();
            alert('Animal guardado correctamente');
        });
    }
    
    // Manejar envío del formulario de registro de nacimiento
    if (birthRegistrationForm) {
        birthRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const birthData = {
                id: 'birth-' + Date.now(),
                animalId: document.getElementById('birthAnimalId').value,
                breed: document.getElementById('birthBreed').value,
                category: document.getElementById('birthAnimalCategory').value,
                sex: document.getElementById('birthAnimalSex').value,
                birthDate: document.getElementById('birthDateInput').value,
                motherCrotal: document.getElementById('birthMotherCrotal').value,
                birthWeight: document.getElementById('birthWeightInput').value,
                birthCondition: document.getElementById('birthConditionInput').value,
                birthNotes: document.getElementById('birthNotesInput').value,
                finca: document.getElementById('birthFinca').value,
                type: 'birth',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Get existing animals
            let animals = JSON.parse(localStorage.getItem('animals') || '[]');
            
            // Add new birth record
            animals.push(birthData);
            
            // Save to localStorage
            localStorage.setItem('animals', JSON.stringify(animals));

            // Add to UI
            addBirthToGrid(birthData);

            // Reset form and close modal
            this.reset();
            birthRegistrationModal.style.display = 'none';
            
            // Update statistics and records
            updateHomeStats();
            updateAllRecordsTab();
            alert('Nacimiento registrado correctamente');
        });
    }
    
    // Function to create animal card
    function addAnimalToGrid(animalData, container = null) {
        if (!container) {
            container = document.querySelector('#newAnimal .animal-cards');
        }
        if (!container) return;
        
        const card = createAnimalCard(animalData);
        container.appendChild(card);
        initAnimalCardListeners(card);
    }

    function addBirthToGrid(birthData, container = null) {
        if (!container) {
            container = document.querySelector('#birthRegistration .animal-cards');
        }
        if (!container) return;
        
        const card = createBirthCard(birthData);
        container.appendChild(card);
        initAnimalCardListeners(card);
    }

    function createAnimalCard(animalData) {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.id = animalData.id || `animal-${Date.now()}`;
        
        const animalIcon = animalData.category === 'porcino' ? 'piggy-bank' : 
                           animalData.category === 'ovino' ? 'sheep' : 
                           animalData.category === 'caprino' ? 'goat' : 'cow';
        
        card.innerHTML = `
            <div class="animal-photo">
                <i class="fas fa-${animalIcon}"></i>
            </div>
            <div class="animal-info">
                <h3>ID: ${animalData.animalId || ''}</h3>
                <p><strong>Categoría:</strong> ${animalData.category || ''}</p>
                <p><strong>Sexo:</strong> ${animalData.sex || ''}</p>
                <p><strong>Raza:</strong> ${animalData.breed || ''}</p>
                <p><strong>Edad:</strong> ${animalData.age || ''} años</p>
                <p><strong>Peso:</strong> ${animalData.weight || ''} kg</p>
                ${animalData.finca ? `<p class="farm-label"><strong>Finca:</strong> ${animalData.finca}</p>` : ''}
            </div>
            <div class="animal-actions">
                <button class="btn-icon edit-animal" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete delete-animal" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        return card;
    }

    function createBirthCard(birthData) {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.id = birthData.id || `birth-${Date.now()}`;
        
        const animalIcon = birthData.category === 'porcino' ? 'piggy-bank' : 
                           birthData.category === 'ovino' ? 'sheep' : 
                           birthData.category === 'caprino' ? 'goat' : 'cow';
        
        card.innerHTML = `
            <div class="animal-photo">
                <i class="fas fa-${animalIcon}"></i>
            </div>
            <div class="animal-info">
                <h3>ID: ${birthData.animalId || ''}</h3>
                <p><strong>Categoría:</strong> ${birthData.category || ''}</p>
                <p><strong>Sexo:</strong> ${birthData.sex || ''}</p>
                <p><strong>Raza:</strong> ${birthData.breed || ''}</p>
                <p><strong>Fecha Nacimiento:</strong> ${birthData.birthDate ? new Date(birthData.birthDate).toLocaleDateString() : ''}</p>
                <p><strong>Madre:</strong> ${birthData.motherCrotal || ''}</p>
                <p><strong>Peso al Nacer:</strong> ${birthData.birthWeight || ''} kg</p>
                ${birthData.finca ? `<p class="farm-label"><strong>Finca:</strong> ${birthData.finca}</p>` : ''}
                ${birthData.birthCondition && birthData.birthCondition !== 'normal' ? `<p><strong>Condición al Nacer:</strong> ${birthData.birthCondition}</p>` : ''}
                ${birthData.birthNotes ? `<p><strong>Observaciones:</strong> ${birthData.birthNotes}</p>` : ''}
            </div>
            <div class="animal-actions">
                <button class="btn-icon edit-birth" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete delete-animal" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        return card;
    }

    function deleteAnimal(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este animal?')) {
            let animals = JSON.parse(localStorage.getItem('animals') || '[]');
            animals = animals.filter(animal => animal.id !== id);
            localStorage.setItem('animals', JSON.stringify(animals));
            
            // Remove from UI
            const card = document.getElementById(id);
            if (card) {
                card.remove();
            }
            
            updateHomeStats();
            updateAllRecordsTab();
        }
    }

    function initAnimalCardListeners(card) {
        if (!card) return;
        
        const deleteBtn = card.querySelector('.delete-animal');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id') || card.id;
                if (id) {
                    deleteAnimal(id);
                }
            });
        }
        
        const editBtn = card.querySelector('.edit-animal, .edit-birth');
        if (editBtn) {
            editBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                // Edit functionality handled in the card click event
            });
        }
        
        // Add click handler to the entire card
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-icon') && !e.target.closest('.animal-actions')) {
                // Functionality to show animal details
                const id = card.id;
                const animalData = getAnimalById(id);
                if (animalData) {
                    if (animalData.type === 'birth') {
                        openBirthEditModal(animalData);
                    } else {
                        openAnimalEditModal(animalData);
                    }
                }
            }
        });
    }

    // Add helper function to get animal by ID
    function getAnimalById(id) {
        if (!id) return null;
        
        const animals = JSON.parse(localStorage.getItem('animals') || '[]');
        return animals.find(animal => animal.id === id) || null;
    }

    // Helper functions to open edit modals
    function openAnimalEditModal(animalData) {
        if (!animalData) return;
        
        const animalModal = document.getElementById('animalModal');
        if (!animalModal) return;
        
        // Set form values
        const animalForm = document.getElementById('animalForm');
        if (!animalForm) return;
        
        const idInput = document.getElementById('animalId');
        if (idInput) idInput.value = animalData.animalId || '';
        
        const breedInput = document.getElementById('breed');
        if (breedInput) breedInput.value = animalData.breed || '';
        
        const categorySelect = document.getElementById('animalCategory');
        if (categorySelect) categorySelect.value = animalData.category || 'vacuno';
        
        const sexSelect = document.getElementById('animalSex');
        if (sexSelect) sexSelect.value = animalData.sex || 'macho';
        
        const ageInput = document.getElementById('age');
        if (ageInput) ageInput.value = animalData.age || '';
        
        const weightInput = document.getElementById('weight');
        if (weightInput) weightInput.value = animalData.weight || '';
        
        const fincaSelect = document.getElementById('animalFinca');
        if (fincaSelect) fincaSelect.value = animalData.finca || '';
        
        // Set form to edit mode
        if (animalForm) {
            animalForm.setAttribute('data-edit-mode', 'true');
            animalForm.setAttribute('data-card-id', animalData.id);
        }
        
        // Change modal title
        const modalTitle = animalModal.querySelector('h2');
        if (modalTitle) modalTitle.textContent = 'Editar Animal';
        
        // Show modal
        animalModal.style.display = 'block';
    }

    function openBirthEditModal(birthData) {
        if (!birthData) return;
        
        const birthModal = document.getElementById('birthRegistrationModal');
        if (!birthModal) return;
        
        // Set form values
        const birthForm = document.getElementById('birthRegistrationForm');
        if (!birthForm) return;
        
        const idInput = document.getElementById('birthAnimalId');
        if (idInput) idInput.value = birthData.animalId || '';
        
        const breedInput = document.getElementById('birthBreed');
        if (breedInput) breedInput.value = birthData.breed || '';
        
        const categorySelect = document.getElementById('birthAnimalCategory');
        if (categorySelect) categorySelect.value = birthData.category || 'vacuno';
        
        const sexSelect = document.getElementById('birthAnimalSex');
        if (sexSelect) sexSelect.value = birthData.sex || 'macho';
        
        const dateInput = document.getElementById('birthDateInput');
        if (dateInput) dateInput.value = birthData.birthDate || '';
        
        const motherInput = document.getElementById('birthMotherCrotal');
        if (motherInput) motherInput.value = birthData.motherCrotal || '';
        
        const weightInput = document.getElementById('birthWeightInput');
        if (weightInput) weightInput.value = birthData.birthWeight || '';
        
        const conditionSelect = document.getElementById('birthConditionInput');
        if (conditionSelect) conditionSelect.value = birthData.birthCondition || 'normal';
        
        const notesInput = document.getElementById('birthNotesInput');
        if (notesInput) notesInput.value = birthData.birthNotes || '';
        
        const fincaSelect = document.getElementById('birthFinca');
        if (fincaSelect) fincaSelect.value = birthData.finca || '';
        
        // Change modal title
        const modalTitle = birthModal.querySelector('h2');
        if (modalTitle) modalTitle.textContent = 'Editar Registro de Nacimiento';
        
        // Show modal
        birthModal.style.display = 'block';
    }

    function updateAnimalCard(animalData) {
        const existingCard = document.getElementById(animalData.id);
        if (existingCard) {
            const newCard = createAnimalCard(animalData);
            existingCard.replaceWith(newCard);
            initAnimalCardListeners(newCard);
        }
    }

    // Load animals from localStorage
    const animals = JSON.parse(localStorage.getItem('animals') || '[]');
    
    // Add regular animals to their container
    const regularAnimals = animals.filter(a => a.type !== 'birth');
    regularAnimals.forEach(animal => addAnimalToGrid(animal));
    
    // Add birth records to their container
    const birthRecords = animals.filter(a => a.type === 'birth');
    birthRecords.forEach(birth => addBirthToGrid(birth));
    
    // Botones para gestionar fincas
    const addFincaBtn = document.querySelector('.add-finca-btn');
    const addFincaModalBtn = document.getElementById('addFincaBtn');
    const fincaModal = document.getElementById('fincaModal');
    const closeFincaModal = document.querySelector('.close-finca-modal');
    const cancelFincaBtn = document.getElementById('cancelFinca');
    const deleteFincaBtns = document.querySelectorAll('.delete-finca');
    
    // Abrir modal para añadir nueva finca desde la cabecera
    if (addFincaBtn) {
        addFincaBtn.addEventListener('click', function() {
            fincaModal.style.display = 'block';
            document.getElementById('fincaForm').reset();
            document.getElementById('fincaModalTitle').textContent = 'Añadir Nueva Finca';
        });
    }
    
    // Abrir modal para añadir nueva finca desde la sección de fincas
    if (addFincaModalBtn) {
        addFincaModalBtn.addEventListener('click', function() {
            fincaModal.style.display = 'block';
            document.getElementById('fincaForm').reset();
            document.getElementById('fincaModalTitle').textContent = 'Añadir Nueva Finca';
        });
    }
    
    // Cerrar modal de fincas
    if (closeFincaModal) {
        closeFincaModal.addEventListener('click', function() {
            fincaModal.style.display = 'none';
        });
    }
    
    // Cerrar modal con botón cancelar
    if (cancelFincaBtn) {
        cancelFincaBtn.addEventListener('click', function() {
            fincaModal.style.display = 'none';
        });
    }
    
    // Cerrar modal haciendo clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === fincaModal) {
            fincaModal.style.display = 'none';
        }
    });
    
    // Inicializar botones de eliminar fincas
    if (deleteFincaBtns.length > 0) {
        deleteFincaBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('¿Estás seguro de que quieres eliminar esta finca?')) {
                    // En una implementación real, aquí iría la lógica para eliminar la finca de la BD
                    const card = this.closest('.finca-card');
                    if (card) {
                        const fincaName = card.querySelector('h3').textContent;
                        card.remove();
                        
                        // Eliminar también del selector de fincas
                        const option = document.querySelector(`#fincaSelector option[value="${fincaName.toLowerCase().replace(/\s+/g, '').trim()}"]`);
                        if (option) {
                            option.remove();
                        }
                        
                        // Si era la finca seleccionada actualmente, seleccionar otra
                        if (farmSelector.options.length > 0) {
                            farmSelector.selectedIndex = 0;
                            document.getElementById('currentFincaName').textContent = farmSelector.options[0].textContent;
                            
                            // Actualizar visualización de animales según la nueva finca seleccionada
                            updateAnimalFarmLabels(farmSelector.options[0].textContent);
                        } else {
                            document.getElementById('currentFincaName').textContent = "Sin fincas";
                        }
                        
                        alert('Finca eliminada correctamente');
                    }
                }
            });
        });
    }
    
    // Manejar envío del formulario de fincas
    const fincaForm = document.getElementById('fincaForm');
    if (fincaForm) {
        fincaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fincaData = {
                id: currentEditingFincaId || `finca-${Date.now()}`,
                name: document.getElementById('newFincaName').value,
                location: document.getElementById('newLocation').value,
                size: document.getElementById('newFarmSize').value,
                cattleType: document.getElementById('newCattleType').value,
                timestamp: new Date().toISOString()
            };

            let fincas = JSON.parse(localStorage.getItem('fincas') || '[]');
            
            if (fincaEditMode) {
                // Update existing farm
                const index = fincas.findIndex(f => f.id === currentEditingFincaId);
                if (index !== -1) {
                    fincas[index] = fincaData;
                }
            } else {
                // Add new farm
                fincas.push(fincaData);
            }

            localStorage.setItem('fincas', JSON.stringify(fincas));
            loadFincas(); // New function to load/render farms
            loadFincasInSelectors(); // Update selectors with new fincas
            resetFincaForm();
            fincaModal.style.display = 'none';
        });
    }
    
    // New function to load farms from localStorage and render
    function loadFincas() {
        const fincasGrid = document.querySelector('.fincas-grid');
        fincasGrid.innerHTML = '';
        
        const fincas = JSON.parse(localStorage.getItem('fincas') || '[]');
        
        fincas.forEach(finca => {
            const card = document.createElement('div');
            card.className = 'finca-card';
            card.dataset.fincaId = finca.id;
            card.innerHTML = `
                <h3>${finca.name}</h3>
                <p><strong>Ubicación:</strong> ${finca.location}</p>
                <p><strong>Tamaño:</strong> ${finca.size} hectáreas</p>
                <p><strong>Tipo de Ganado:</strong> ${finca.cattleType || 'No especificado'}</p>
                <div class="finca-actions">
                    <button class="btn-icon edit-finca" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete delete-finca" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add edit/delete handlers
            card.querySelector('.edit-finca').addEventListener('click', () => openFincaEditModal(finca));
            card.querySelector('.delete-finca').addEventListener('click', handleDeleteFinca);
            
            fincasGrid.appendChild(card);
        });
    }
    
    // New function to open farm edit modal
    function openFincaEditModal(finca) {
        fincaEditMode = true;
        currentEditingFincaId = finca.id;
        
        document.getElementById('newFincaName').value = finca.name;
        document.getElementById('newLocation').value = finca.location;
        document.getElementById('newFarmSize').value = finca.size;
        document.getElementById('newCattleType').value = finca.cattleType;
        
        document.getElementById('fincaModalTitle').textContent = 'Editar Finca';
        fincaModal.style.display = 'block';
    }
    
    // Modified delete handler
    function handleDeleteFinca(e) {
        const card = e.target.closest('.finca-card');
        const fincaId = card.dataset.fincaId;

        if (confirm('¿Estás seguro de que quieres eliminar esta finca?')) {
            let fincas = JSON.parse(localStorage.getItem('fincas') || '[]');
            fincas = fincas.filter(f => f.id !== fincaId);
            localStorage.setItem('fincas', JSON.stringify(fincas));
            card.remove();
            loadFincas();
            loadFincasInSelectors();
        }
    }
    
    // Modified finca form reset
    function resetFincaForm() {
        fincaForm.reset();
        fincaEditMode = false;
        currentEditingFincaId = null;
        document.getElementById('fincaModalTitle').textContent = 'Nueva Finca';
    }
    
    // Add initial load when fincas section is shown
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            if (sectionId === 'fincas') loadFincas();
        });
    });
    
    // Initialize on first load
    document.addEventListener('DOMContentLoaded', loadFincas);
    
    // Variable para modo de edición de finca
    let fincaEditMode = false;
    let currentEditingFincaId = null;
    
    // Añadir funcionalidad para mover animales entre fincas
    const moveAnimalBtns = document.querySelectorAll('.move-animal');
    const moveAnimalModal = document.getElementById('moveAnimalModal');
    const moveAnimalForm = document.getElementById('moveAnimalForm');
    const closeMoveModal = document.querySelector('.close-move-modal');
    const cancelMoveBtn = document.getElementById('cancelMoveAnimal');
    
    // Inicializar botones para mover animales
    if (moveAnimalBtns.length > 0) {
        moveAnimalBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.animal-card');
                if (card) {
                    const animalId = card.querySelector('h3').textContent;
                    document.getElementById('moveAnimalId').textContent = animalId;
                    
                    // Cargar opciones de fincas de destino
                    const destinationSelect = document.getElementById('destinationFarm');
                    destinationSelect.innerHTML = '';
                    
                    const currentFinca = document.getElementById('currentFincaName').textContent;
                    
                    // Obtener todas las fincas disponibles
                    const fincaOptions = document.querySelectorAll('#fincaSelector option');
                    fincaOptions.forEach(option => {
                        // No incluir la finca actual como destino
                        if (option.textContent !== currentFinca) {
                            const newOption = document.createElement('option');
                            newOption.value = option.value;
                            newOption.textContent = option.textContent;
                            destinationSelect.appendChild(newOption);
                        }
                    });
                    
                    // Mostrar el modal
                    moveAnimalModal.style.display = 'block';
                    
                    // Guardar referencia al animal que se va a mover
                    moveAnimalForm.setAttribute('data-card-id', card.id || '');
                }
            });
        });
    }
    
    // Cerrar modal de mover animal
    if (closeMoveModal) {
        closeMoveModal.addEventListener('click', function() {
            moveAnimalModal.style.display = 'none';
        });
    }
    
    // Cerrar modal con botón cancelar
    if (cancelMoveBtn) {
        cancelMoveBtn.addEventListener('click', function() {
            moveAnimalModal.style.display = 'none';
        });
    }
    
    // Manejar envío del formulario para mover animal
    if (moveAnimalForm) {
        moveAnimalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cardId = this.getAttribute('data-card-id');
            const destinationFarm = document.getElementById('destinationFarm').value;
            const destinationFarmName = document.querySelector(`#destinationFarm option[value="${destinationFarm}"]`).textContent;
            
            // Encontrar la tarjeta del animal
            const card = document.getElementById(cardId);
            if (card) {
                // En una implementación real, aquí actualizaríamos la base de datos
                
                // Añadir indicador de finca al animal
                let farmLabel = card.querySelector('.farm-label');
                if (!farmLabel) {
                    farmLabel = document.createElement('p');
                    farmLabel.className = 'farm-label';
                    card.querySelector('.animal-info').appendChild(farmLabel);
                }
                farmLabel.innerHTML = `<strong>Finca:</strong> ${destinationFarmName}`;
                
                // Ocultar el animal si ya no pertenece a la finca actual
                const currentFinca = document.getElementById('currentFincaName').textContent;
                if (currentFinca !== destinationFarmName) {
                    card.style.display = 'none';
                }
                
                alert(`Animal movido exitosamente a ${destinationFarmName}`);
            }
            
            // Cerrar el modal
            moveAnimalModal.style.display = 'none';
        });
    }
    
    // Actualizar el resumen del dashboard
    function updateDashboardSummary() {
        // Función removida ya que no existe más la sección de dashboard
        // Pero dejamos el stub para evitar errores en llamadas existentes
    }
    
    // Inicializar cambio de tipografía
    function initFontChange() {
        const fontSelector = document.getElementById('fontSelector');
        const applyFontBtn = document.getElementById('applyFontBtn');
        const previewText = document.getElementById('fontPreview');
        
        if (fontSelector && applyFontBtn && previewText) {
            // Restaurar tipografía guardada si existe
            const savedFont = localStorage.getItem('appFontFamily');
            if (savedFont) {
                document.documentElement.style.setProperty('--font-family', savedFont);
                fontSelector.value = savedFont;
                previewText.style.fontFamily = savedFont;
            }
            
            // Previsualizar tipografía seleccionada
            fontSelector.addEventListener('change', function() {
                previewText.style.fontFamily = this.value;
            });
            
            // Aplicar tipografía a toda la aplicación
            applyFontBtn.addEventListener('click', function() {
                const selectedFont = fontSelector.value;
                // Extrae el nombre de la fuente removiendo comillas y obteniendo la primera parte
                let fontName = selectedFont.split(',')[0].replace(/['"]/g, '');
                // Lista de fuentes Google que se cargarán dinámicamente
                const googleFonts = ["Roboto", "Open Sans", "Lato", "Montserrat", "Nunito"];
                if (googleFonts.includes(fontName)) {
                    WebFont.load({
                        google: {
                            families: [fontName]
                        },
                        active: function() {
                            document.documentElement.style.setProperty('--font-family', selectedFont);
                            localStorage.setItem('appFontFamily', selectedFont);
                            alert('Tipografía cambiada correctamente');
                        },
                        inactive: function() {
                            // Si falla la carga, se aplica la fuente de todos modos
                            document.documentElement.style.setProperty('--font-family', selectedFont);
                            localStorage.setItem('appFontFamily', selectedFont);
                            alert('Tipografía cambiada (carga fallida)');
                        }
                    });
                } else {
                    document.documentElement.style.setProperty('--font-family', selectedFont);
                    localStorage.setItem('appFontFamily', selectedFont);
                    alert('Tipografía cambiada correctamente');
                }
            });
        }
    }
    
    // Tabs de Informes
    const reportTabBtns = document.querySelectorAll('.reports-tabs .tab-btn');
    const reportTabContents = document.querySelectorAll('.reports-tab-content');
    
    if (reportTabBtns.length > 0) {
        reportTabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover active de todos los botones
                reportTabBtns.forEach(button => button.classList.remove('active'));
                // Agregar active al botón seleccionado
                this.classList.add('active');
                
                // Ocultar todos los contenidos
                reportTabContents.forEach(content => content.classList.remove('active'));
                
                // Mostrar el contenido correspondiente
                const tabId = this.getAttribute('data-reports-tab') + 'Tab';
                document.getElementById(tabId).classList.add('active');
                
                // Load saved files when switching to a tab
                loadSavedFiles();
            });
        });
    }
    
    // Manejar subida de archivos para Guías
    const uploadGuiasBtn = document.getElementById('uploadGuiasBtn');
    const guiasFileInput = document.getElementById('guiasFileInput');
    const guiasFilesList = document.getElementById('guiasFilesList');
    
    if (uploadGuiasBtn && guiasFileInput && guiasFilesList) {
        uploadGuiasBtn.addEventListener('click', function() {
            guiasFileInput.click();
        });
        
        guiasFileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleFileUpload(this.files, guiasFilesList, 'Guía');
            }
        });
    }
    
    // Manejar subida de archivos para PAC
    const uploadPacBtn = document.getElementById('uploadPacBtn');
    const pacFileInput = document.getElementById('pacFileInput');
    const pacFilesList = document.getElementById('pacFilesList');
    
    if (uploadPacBtn && pacFileInput && pacFilesList) {
        uploadPacBtn.addEventListener('click', function() {
            pacFileInput.click();
        });
        
        pacFileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleFileUpload(this.files, pacFilesList, 'PAC');
            }
        });
    }
    
    // Initialize delete buttons for all editable sections
    function initSectionDeleteButtons() {
        const sectionIds = ['feeding', 'fincas'];
        
        sectionIds.forEach(sectionId => {
            const deleteBtn = document.getElementById(`delete${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}Btn`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    if (confirm(`¿Estás seguro de que quieres eliminar todo el contenido de ${sectionId}?`)) {
                        // Clear the section content
                        const contentContainer = document.getElementById(`${sectionId}Content`);
                        if (contentContainer) {
                            contentContainer.innerHTML = '';
                        }
                        
                        // Clear from localStorage
                        localStorage.removeItem(`${sectionId}Content`);
                        
                        alert(`Contenido de ${sectionId} eliminado correctamente`);
                    }
                });
            }
        });
    }
    
    // Function to load saved files on page load
    function loadSavedFiles() {
        // Load PAC files
        const pacFilesList = document.getElementById('pacFilesList');
        if (pacFilesList) {
            const pacFiles = JSON.parse(localStorage.getItem('pacFiles') || '[]');
            if (pacFiles.length > 0) {
                // Clear container first
                pacFilesList.innerHTML = '';
                
                pacFiles.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.id = file.id;
                    
                    fileItem.innerHTML = `
                        <i class="fas fa-file"></i>
                        <span class="file-name">${file.name}</span>
                        <span class="file-type">${file.type}</span>
                        <span class="file-size">${(file.size / 1024).toFixed(2)} KB</span>
                        <div class="file-actions">
                            <button class="btn-icon btn-delete delete-file" data-file-id="${file.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    pacFilesList.appendChild(fileItem);
                    
                    // Add delete handler
                    const deleteBtn = fileItem.querySelector('.delete-file');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', function() {
                            const fileId = this.getAttribute('data-file-id');
                            // Remove from UI
                            document.getElementById(fileId).remove();
                            // Remove from saved files
                            const pacFiles = JSON.parse(localStorage.getItem('pacFiles') || '[]');
                            const updatedFiles = pacFiles.filter(f => f.id !== fileId);
                            localStorage.setItem('pacFiles', JSON.stringify(updatedFiles));
                            
                            // Add empty message if no files left
                            if (updatedFiles.length === 0) {
                                const emptyMessage = document.createElement('p');
                                emptyMessage.className = 'empty-list-message';
                                emptyMessage.textContent = 'No hay archivos subidos. Usa el botón "Subir Archivos" para añadir documentación.';
                                pacFilesList.appendChild(emptyMessage);
                            }
                        });
                    }
                });
            }
        }
        
        // Load Guia files
        const guiasFilesList = document.getElementById('guiasFilesList');
        if (guiasFilesList) {
            const guiaFiles = JSON.parse(localStorage.getItem('guiaFiles') || '[]');
            if (guiaFiles.length > 0) {
                // Clear container first
                guiasFilesList.innerHTML = '';
                
                guiaFiles.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.id = file.id;
                    
                    fileItem.innerHTML = `
                        <i class="fas fa-file"></i>
                        <span class="file-name">${file.name}</span>
                        <span class="file-type">${file.type}</span>
                        <span class="file-size">${(file.size / 1024).toFixed(2)} KB</span>
                        <div class="file-actions">
                            <button class="btn-icon btn-delete delete-file" data-file-id="${file.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    guiasFilesList.appendChild(fileItem);
                    
                    // Add delete handler
                    const deleteBtn = fileItem.querySelector('.delete-file');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', function() {
                            const fileId = this.getAttribute('data-file-id');
                            // Remove from UI
                            document.getElementById(fileId).remove();
                            // Remove from saved files
                            const guiaFiles = JSON.parse(localStorage.getItem('guiaFiles') || '[]');
                            const updatedFiles = guiaFiles.filter(f => f.id !== fileId);
                            localStorage.setItem('guiaFiles', JSON.stringify(updatedFiles));
                            
                            // Add empty message if no files left
                            if (updatedFiles.length === 0) {
                                const emptyMessage = document.createElement('p');
                                emptyMessage.className = 'empty-list-message';
                                emptyMessage.textContent = 'No hay guías registradas. Usa el botón "Subir Guía" para añadir documentación.';
                                guiasFilesList.appendChild(emptyMessage);
                            }
                        });
                    }
                });
            }
        }
    }
    
    // Function to handle file upload
    function handleFileUpload(files, container, type) {
        if (!files || !container) return;
        
        // Clear empty message if it exists
        const emptyMessage = container.querySelector('.empty-list-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }
        
        // Get existing files from localStorage or initialize empty array
        const storageKey = type === 'Guía' ? 'guiaFiles' : 'pacFiles';
        let savedFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        Array.from(files).forEach(file => {
            const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Create file object to save
            const fileObject = {
                id: fileId,
                name: file.name,
                type: type,
                size: file.size,
                lastModified: file.lastModified,
                date: new Date().toISOString()
            };
            
            // Add to savedFiles array
            savedFiles.push(fileObject);
            
            // Create UI element
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.id = fileId;
            
            fileItem.innerHTML = `
                <i class="fas fa-file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-type">${type}</span>
                <span class="file-size">${(file.size / 1024).toFixed(2)} KB</span>
                <div class="file-actions">
                    <button class="btn-icon btn-delete delete-file" data-file-id="${fileId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(fileItem);
            
            // Add delete handler
            const deleteBtn = fileItem.querySelector('.delete-file');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    const fileId = this.getAttribute('data-file-id');
                    // Remove from UI
                    document.getElementById(fileId).remove();
                    // Remove from saved files
                    savedFiles = savedFiles.filter(f => f.id !== fileId);
                    localStorage.setItem(storageKey, JSON.stringify(savedFiles));
                    
                    // Add empty message if no files left
                    if (savedFiles.length === 0 && container.children.length === 0) {
                        const emptyMessage = document.createElement('p');
                        emptyMessage.className = 'empty-list-message';
                        emptyMessage.textContent = `No hay ${type === 'Guía' ? 'guías registradas' : 'archivos subidos'}. Usa el botón "Subir ${type === 'Guía' ? 'Guía' : 'Archivos'}" para añadir documentación.`;
                        container.appendChild(emptyMessage);
                    }
                });
            }
        });
        
        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(savedFiles));
    }
    
    // Add loadSavedFiles to DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing code ...
        
        // Load saved files
        loadSavedFiles();
        
        // ... existing code ...
    });
    
    // Also make sure to load files when the reports section is clicked in the sidebar
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            if (sectionId === 'reports') {
                loadSavedFiles();
            }
            
            // ... existing code ...
        });
    });
    
    // Finanzas
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const transactionModal = document.getElementById('transactionModal');
    const closeTransactionModal = transactionModal?.querySelector('.close-modal');
    const cancelTransactionBtn = document.getElementById('cancelTransaction');
    const transactionForm = document.getElementById('transactionForm');
    
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    const budgetModal = document.getElementById('budgetModal');
    const closeBudgetModal = budgetModal?.querySelector('.close-modal');
    const cancelBudgetBtn = document.getElementById('cancelBudget');
    const budgetForm = document.getElementById('budgetForm');
    
    // Configurar fecha actual para transacciones y presupuestos
    if (document.getElementById('transactionDate')) {
        document.getElementById('transactionDate').valueAsDate = new Date();
    }
    
    if (document.getElementById('budgetStartMonth')) {
        const today = new Date();
        document.getElementById('budgetStartMonth').value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    }
    
    // Actualizar el display del mes actual
    function updateCurrentMonthDisplay() {
        const currentDate = new Date();
        const currentMonthDisplay = document.getElementById('currentMonthDisplay');
        if (currentMonthDisplay) {
            currentMonthDisplay.textContent = currentDate.toLocaleDateString('es-ES', {
                month: 'long',
                year: 'numeric'
            });
        }
    }
    
    // Eventos para finanzas
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', function() {
            openTransactionModal();
        });
    }
    
    if (closeTransactionModal) {
        closeTransactionModal.addEventListener('click', function() {
            transactionModal.style.display = 'none';
        });
    }
    
    if (cancelTransactionBtn) {
        cancelTransactionBtn.addEventListener('click', function() {
            transactionModal.style.display = 'none';
        });
    }
    
    if (addBudgetBtn) {
        addBudgetBtn.addEventListener('click', function() {
            openBudgetModal();
        });
    }
    
    if (closeBudgetModal) {
        closeBudgetModal.addEventListener('click', function() {
            budgetModal.style.display = 'none';
        });
    }
    
    if (cancelBudgetBtn) {
        cancelBudgetBtn.addEventListener('click', function() {
            budgetModal.style.display = 'none';
        });
    }
    
    // Eventos para los formularios de finanzas
    if (transactionForm) {
        transactionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveTransaction();
        });
    }
    
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveBudget();
        });
    }
    
    // Inicializar datos financieros cuando se carga la sección
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            if (sectionId === 'finances') {
                loadFinancialData();
                initCharts();
                loadTransactions();
                loadBudgets();
                updateFinancialSummary();
            }
        });
    });
    
    // Función para abrir el modal de transacciones
    function openTransactionModal(transaction = null) {
        const modalTitle = document.getElementById('transactionModalTitle');
        const form = document.getElementById('transactionForm');
        
        // Resetear formulario
        form.reset();
        document.getElementById('transactionId').value = '';
        
        // Configurar fecha actual por defecto
        document.getElementById('transactionDate').valueAsDate = new Date();
        
        if (transaction) {
            // Modo edición
            modalTitle.textContent = 'Editar Transacción';
            document.getElementById('transactionId').value = transaction.id;
            document.getElementById('transactionName').value = transaction.name;
            document.getElementById('transactionType').value = transaction.type;
            document.getElementById('transactionAmount').value = transaction.amount;
            document.getElementById('transactionDate').value = transaction.date;
            document.getElementById('transactionCategory').value = transaction.category;
            document.getElementById('transactionNotes').value = transaction.notes || '';
        } else {
            // Modo nueva transacción
            modalTitle.textContent = 'Nueva Transacción';
        }
        
        transactionModal.style.display = 'block';
    }
    
    // Función para abrir el modal de presupuestos
    function openBudgetModal(budget = null) {
        const form = document.getElementById('budgetForm');
        
        // Resetear formulario
        form.reset();
        document.getElementById('budgetId').value = '';
        
        // Configurar mes actual por defecto
        const today = new Date();
        document.getElementById('budgetStartMonth').value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        
        if (budget) {
            // Modo edición
            document.getElementById('budgetId').value = budget.id;
            document.getElementById('budgetCategory').value = budget.category;
            document.getElementById('budgetAmount').value = budget.amount;
            document.getElementById('budgetPeriod').value = budget.period;
            document.getElementById('budgetStartMonth').value = budget.startMonth;
            document.getElementById('budgetNotes').value = budget.notes || '';
        }
        
        budgetModal.style.display = 'block';
    }
    
    // Función para guardar transacción
    function saveTransaction() {
        const transactionId = document.getElementById('transactionId').value;
        const name = document.getElementById('transactionName').value;
        const type = document.getElementById('transactionType').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const date = document.getElementById('transactionDate').value;
        const category = document.getElementById('transactionCategory').value;
        const notes = document.getElementById('transactionNotes').value;
        
        const isEditing = transactionId !== '';
        
        // Crear objeto de transacción
        const transaction = {
            id: isEditing ? transactionId : Date.now().toString(),
            name,
            type,
            amount,
            date,
            category,
            notes,
            timestamp: new Date().toISOString()
        };
        
        // Obtener transacciones existentes
        let transactions = JSON.parse(localStorage.getItem('financeTransactions') || '[]');
        
        if (isEditing) {
            // Actualizar transacción existente
            const index = transactions.findIndex(t => t.id === transactionId);
            if (index !== -1) {
                transactions[index] = transaction;
            }
        } else {
            // Añadir nueva transacción
            transactions.push(transaction);
        }
        
        // Guardar en localStorage
        localStorage.setItem('financeTransactions', JSON.stringify(transactions));
        
        // Actualizar la interfaz
        loadTransactions();
        updateFinancialSummary();
        initCharts();
        
        // Cerrar modal
        transactionModal.style.display = 'none';
        
        // Mostrar mensaje de éxito
        alert(`Transacción ${isEditing ? 'actualizada' : 'guardada'} correctamente`);
    }
    
    // Función para guardar presupuesto
    function saveBudget() {
        const budgetId = document.getElementById('budgetId').value;
        const category = document.getElementById('budgetCategory').value;
        const amount = parseFloat(document.getElementById('budgetAmount').value);
        const period = document.getElementById('budgetPeriod').value;
        const startMonth = document.getElementById('budgetStartMonth').value;
        const notes = document.getElementById('budgetNotes').value;
        
        const isEditing = budgetId !== '';
        
        // Crear objeto de presupuesto
        const budget = {
            id: isEditing ? budgetId : Date.now().toString(),
            category,
            amount,
            period,
            startMonth,
            notes,
            timestamp: new Date().toISOString()
        };
        
        // Obtener presupuestos existentes
        let budgets = JSON.parse(localStorage.getItem('financeBudgets') || '[]');
        
        if (isEditing) {
            // Actualizar presupuesto existente
            const index = budgets.findIndex(b => b.id === budgetId);
            if (index !== -1) {
                budgets[index] = budget;
            }
        } else {
            // Añadir nuevo presupuesto
            budgets.push(budget);
        }
        
        // Guardar en localStorage
        localStorage.setItem('financeBudgets', JSON.stringify(budgets));
        
        // Actualizar la interfaz
        loadBudgets();
        
        // Cerrar modal
        budgetModal.style.display = 'none';
        
        // Mostrar mensaje de éxito
        alert(`Presupuesto ${isEditing ? 'actualizado' : 'guardado'} correctamente`);
    }
    
    // Función para cargar transacciones
    function loadTransactions() {
        const tableBody = document.getElementById('transactionsTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Obtener transacciones de localStorage
        const transactions = JSON.parse(localStorage.getItem('financeTransactions') || '[]');
        
        // Ordenar por fecha (más reciente primero)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Mostrar las más recientes (limitado a 10 para esta vista)
        const recentTransactions = transactions.slice(0, 10);
        
        if (recentTransactions.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="6" class="empty-table-message">No hay transacciones registradas</td>`;
            tableBody.appendChild(emptyRow);
            return;
        }
        
        // Categorías localizadas
        const categoryNames = {
            sales: 'Ventas',
            subsidies: 'Subvenciones',
            services: 'Servicios',
            other_income: 'Otros ingresos',
            feed: 'Alimentación animal',
            veterinary: 'Veterinario',
            supplies: 'Suministros',
            equipment: 'Equipamiento',
            maintenance: 'Mantenimiento',
            fuel: 'Combustible',
            taxes: 'Impuestos',
            salary: 'Salarios',
            other_expense: 'Otros gastos',
            investment: 'Inversiones',
            reserve: 'Fondo de reserva',
            expansion: 'Expansión'
        };
        
        // Tipos localizados
        const typeNames = {
            income: 'Ingreso',
            expense: 'Gasto',
            saving: 'Ahorro'
        };
        
        // Clase CSS según tipo
        const typeClasses = {
            income: 'amount-positive',
            expense: 'amount-negative',
            saving: ''
        };
        
        recentTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            // Formatear fecha
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString();
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${transaction.name}</td>
                <td>${categoryNames[transaction.category] || transaction.category}</td>
                <td>${typeNames[transaction.type] || transaction.type}</td>
                <td class="${typeClasses[transaction.type]}">${transaction.amount.toFixed(2)} €</td>
                <td>
                    <button class="btn-icon edit-transaction" data-id="${transaction.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete delete-transaction" data-id="${transaction.id}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Añadir eventos a los botones de editar y eliminar
        const editButtons = document.querySelectorAll('.edit-transaction');
        const deleteButtons = document.querySelectorAll('.delete-transaction');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const transactionId = this.getAttribute('data-id');
                const transactions = JSON.parse(localStorage.getItem('financeTransactions') || '[]');
                const transaction = transactions.find(t => t.id === transactionId);
                
                if (transaction) {
                    openTransactionModal(transaction);
                }
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
                    const transactionId = this.getAttribute('data-id');
                    let transactions = JSON.parse(localStorage.getItem('financeTransactions') || '[]');
                    
                    transactions = transactions.filter(t => t.id !== transactionId);
                    localStorage.setItem('financeTransactions', JSON.stringify(transactions));
                    
                    loadTransactions();
                    updateFinancialSummary();
                    initCharts();
                    
                    alert('Transacción eliminada correctamente');
                }
            });
        });
    }
    
    // Función para cargar presupuestos
    function loadBudgets() {
        const budgetsContainer = document.getElementById('budgetsContainer');
        if (!budgetsContainer) return;
        
        budgetsContainer.innerHTML = '';
        
        // Obtener presupuestos y transacciones
        const budgets = JSON.parse(localStorage.getItem('financeBudgets') || '[]');
        const transactions = JSON.parse(localStorage.getItem('financeTransactions') || '[]');
        
        if (budgets.length === 0) {
            budgetsContainer.innerHTML = '<p class="empty-list-message">No hay presupuestos configurados</p>';
            return;
        }
        
        // Categorías localizadas
        const categoryNames = {
            feed: 'Alimentación animal',
            veterinary: 'Veterinario',
            supplies: 'Suministros',
            equipment: 'Equipamiento',
            maintenance: 'Mantenimiento',
            fuel: 'Combustible',
            taxes: 'Impuestos',
            salary: 'Salarios',
            other_expense: 'Otros gastos'
        };
        
        // Períodos localizados
        const periodNames = {
            monthly: 'Mensual',
            quarterly: 'Trimestral',
            yearly: 'Anual'
        };
        
        budgets.forEach(budget => {
            // Calcular gasto actual para la categoría del presupuesto
            let currentSpent = 0;
            
            // Obtener fecha de inicio del presupuesto y calcular fecha final según el período
            const startDate = new Date(budget.startMonth);
            let endDate;
            
            switch(budget.period) {
                case 'monthly':
                    endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + 1);
                    break;
                case 'quarterly':
                    endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + 3);
                    break;
                case 'yearly':
                    endDate = new Date(startDate);
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    break;
                default:
                    endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + 1);
            }
            
            // Filtrar transacciones del mes actual
            transactions.forEach(transaction => {
                const transactionDate = new Date(transaction.date);
                if (transactionDate >= startDate && transactionDate < endDate) {
                    const amount = parseFloat(transaction.amount);
                    
                    if (transaction.type === 'expense' && transaction.category === budget.category) {
                        currentSpent += amount;
                    }
                }
            });
            
            // Calcular porcentaje de gasto
            const percentSpent = (currentSpent / budget.amount) * 100;
            
            // Determinar clase para la barra de progreso
            let progressClass = '';
            if (percentSpent >= 90) {
                progressClass = 'danger';
            } else if (percentSpent >= 75) {
                progressClass = 'warning';
            }
            
            // Crear elemento de presupuesto
            const budgetElement = document.createElement('div');
            budgetElement.className = 'budget-item';
            
            // Formatear montos
            const formattedBudget = budget.amount.toFixed(2);
            
            const formattedSpent = currentSpent.toFixed(2);
            
            // Formatear fecha
            const startMonth = new Date(budget.startMonth + '-01');
            const formattedStartMonth = startMonth.toLocaleDateString('es-ES', {
                month: 'long',
                year: 'numeric'
            });
            
            budgetElement.innerHTML = `
                <h4>${categoryNames[budget.category] || budget.category}</h4>
                <div class="budget-amount">${formattedBudget} €</div>
                <div class="budget-period">${periodNames[budget.period]} (desde ${formattedStartMonth})</div>
                <div class="budget-progress">
                    <div class="budget-progress-bar ${progressClass}" style="width: ${Math.min(percentSpent, 100)}%"></div>
                </div>
                <div class="budget-status">
                    <span>${formattedSpent} €</span>
                    <span>${percentSpent.toFixed(0)}%</span>
                </div>
                <div class="budget-actions">
                    <button class="btn-icon edit-budget" data-id="${budget.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete delete-budget" data-id="${budget.id}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            budgetsContainer.appendChild(budgetElement);
        });
        
        // Añadir eventos a los botones de editar y eliminar
        const editButtons = document.querySelectorAll('.edit-budget');
        const deleteButtons = document.querySelectorAll('.delete-budget');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const budgetId = this.getAttribute('data-id');
                const budgets = JSON.parse(localStorage.getItem('financeBudgets') || '[]');
                const budget = budgets.find(b => b.id === budgetId);
                
                if (budget) {
                    openBudgetModal(budget);
                }
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
                    const budgetId = this.getAttribute('data-id');
                    let budgets = JSON.parse(localStorage.getItem('financeBudgets') || '[]');
                    
                    budgets = budgets.filter(b => b.id !== budgetId);
                    localStorage.setItem('financeBudgets', JSON.stringify(budgets));
                    
                    loadBudgets();
                    
                    alert('Presupuesto eliminado correctamente');
                }
            });
        });
    }
    
    // Función para actualizar resumen financiero
    function updateFinancialSummary() {
        const totalIncomeElement = document.getElementById('totalIncome');
        const totalExpensesElement = document.getElementById('totalExpenses');
        const totalBalanceElement = document.getElementById('totalBalance');
        const totalSavingsElement = document.getElementById('totalSavings');
        
        if (!totalIncomeElement) {
            console.warn('totalIncomeElement not found');
            return;
        }
        
        // Obtener transacciones
        const transactions = JSON.parse(localStorage.getItem('financeTransactions') || '[]');
        
        // Calcular totales
        let totalIncome = 0;
        let totalExpenses = 0;
        let totalSavings = 0;
        
        transactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            
            if (transaction.type === 'income') {
                totalIncome += amount;
            } else if (transaction.type === 'expense') {
                totalExpenses += amount;
            } else if (transaction.type === 'saving') {
                totalSavings += amount;
            }
        });
        
        const totalBalance = totalIncome - totalExpenses;
        
        // Formatear valores
        const formatter = new Intl.NumberFormat('es-ES', { 
            style: 'currency', 
            currency: 'EUR' 
        });
        
        if (totalIncomeElement) {
            totalIncomeElement.textContent = formatter.format(totalIncome);
        }
        
        if (totalExpensesElement) {
            totalExpensesElement.textContent = formatter.format(totalExpenses);
        }
        
        if (totalBalanceElement) {
            totalBalanceElement.textContent = formatter.format(totalBalance);
        }
        
        if (totalSavingsElement) {
            totalSavingsElement.textContent = formatter.format(totalSavings);
        }
        
        // También actualizar el valor en el dashboard si existe
        const quickBalanceElement = document.getElementById('quickBalance');
        if (quickBalanceElement) {
            quickBalanceElement.textContent = formatter.format(totalBalance);
        }
    }
    
    // Función para inicializar gráficos
    function initCharts() {
        initMonthlyChart();
    }
    
    // Función para inicializar gráfico mensual
    function initMonthlyChart() {
        const monthlyChartCanvas = document.getElementById('monthlyChart');
        if (!monthlyChartCanvas) return;
        
        // Obtener transacciones
        const transactions = JSON.parse(localStorage.getItem('financeTransactions') || '[]');
        
        // Obtener mes y año actuales (o seleccionados)
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Crear array con todos los días del mes
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        
        // Preparar datos para el gráfico
        const incomeData = Array(daysInMonth).fill(0);
        const expenseData = Array(daysInMonth).fill(0);
        
        // Filtrar transacciones del mes actual
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate.getFullYear() === year && transactionDate.getMonth() === month) {
                const day = transactionDate.getDate() - 1; // El array empieza en 0
                const amount = parseFloat(transaction.amount);
                
                if (transaction.type === 'income') {
                    incomeData[day] += amount;
                } else if (transaction.type === 'expense') {
                    expenseData[day] += amount;
                }
            }
        });
        
        // Calcular datos acumulados
        const cumulativeBalance = [];
        let runningBalance = 0;
        
        for (let i = 0; i < daysInMonth; i++) {
            runningBalance += incomeData[i] - expenseData[i];
            cumulativeBalance.push(runningBalance);
        }
        
        // Si ya existe un gráfico, destruirlo
        if (window.monthlyChart) {
            window.monthlyChart.destroy();
        }
        
        // Crear nuevo gráfico
        window.monthlyChart = new Chart(monthlyChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: incomeData,
                        backgroundColor: 'rgba(76, 175, 80, 0.5)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Gastos',
                        data: expenseData,
                        backgroundColor: 'rgba(244, 67, 54, 0.5)',
                        borderColor: 'rgba(244, 67, 54, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Balance Acumulado',
                        data: cumulativeBalance,
                        type: 'line',
                        borderColor: 'rgba(33, 150, 243, 1)',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Día del mes'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Importe (€)'
                        },
                        beginAtZero: true
                    },
                    y1: {
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Balance (€)'
                        },
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
    
    // Función para cargar todos los datos financieros
    function loadFinancialData() {
        updateCurrentMonthDisplay();
        initMonthlyChart();
    }
    
    // NUEVA SECCIÓN - GESTIÓN DE ALIMENTACIÓN
    let selectedWeek = new Date();
    
    // Modales y botones para la sección de alimentación
    const addFeedingBtn = document.getElementById('addFeedingBtn');
    const feedingModal = document.getElementById('feedingModal');
    const closeFeedingModal = feedingModal?.querySelector('.close-modal');
    const cancelFeedingBtn = document.getElementById('cancelFeeding');
    const feedingForm = document.getElementById('feedingForm');
    
    const addReminderBtn = document.getElementById('addReminderBtn');
    const reminderModal = document.getElementById('reminderModal');
    const closeReminderModal = reminderModal?.querySelector('.close-modal');
    const cancelReminderBtn = document.getElementById('cancelReminder');
    const reminderForm = document.getElementById('reminderForm');
    
    // Configurar fecha actual para el registro de alimentación
    if (document.getElementById('feedingDate')) {
        document.getElementById('feedingDate').valueAsDate = new Date();
    }
    
    // Configurar fecha actual para recordatorios
    if (document.getElementById('reminderDate')) {
        document.getElementById('reminderDate').valueAsDate = new Date();
    }
    
    // Eventos para la sección de alimentación
    if (addFeedingBtn) {
        addFeedingBtn.addEventListener('click', function() {
            openFeedingModal();
        });
    }
    
    if (closeFeedingModal) {
        closeFeedingModal.addEventListener('click', function() {
            feedingModal.style.display = 'none';
        });
    }
    
    if (cancelFeedingBtn) {
        cancelFeedingBtn.addEventListener('click', function() {
            feedingModal.style.display = 'none';
        });
    }
    
    if (addReminderBtn) {
        addReminderBtn.addEventListener('click', function() {
            openReminderModal();
        });
    }
    
    if (closeReminderModal) {
        closeReminderModal.addEventListener('click', function() {
            reminderModal.style.display = 'none';
        });
    }
    
    if (cancelReminderBtn) {
        cancelReminderBtn.addEventListener('click', function() {
            reminderModal.style.display = 'none';
        });
    }
    
    // Eventos para los formularios de alimentación
    if (feedingForm) {
        feedingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveFeedingRecord();
        });
    }
    
    if (reminderForm) {
        reminderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveReminder();
        });
    }
    
    // Inicializar calculadora de alimentación
    const calculateFeedBtn = document.getElementById('calculateFeedBtn');
    if (calculateFeedBtn) {
        calculateFeedBtn.addEventListener('click', () => {
            calculateFeedRecommendation();
            loadFeedingTips();
        });
    }
    
    // Función para abrir el modal de registro de alimentación
    function openFeedingModal(feeding = null) {
        const modalTitle = document.getElementById('feedingModalTitle');
        const form = document.getElementById('feedingForm');
        
        // Resetear formulario
        form.reset();
        document.getElementById('feedingId').value = '';
        
        // Configurar fecha actual por defecto
        document.getElementById('feedingDate').valueAsDate = new Date();
        
        if (feeding) {
            // Modo edición
            modalTitle.textContent = 'Editar Registro de Alimentación';
            document.getElementById('feedingId').value = feeding.id;
            document.getElementById('feedingDate').value = feeding.date;
            document.getElementById('feedType').value = feeding.feedType;
            document.getElementById('feedAmount').value = feeding.amount;
            document.getElementById('animalGroup').value = feeding.animalGroup;
            document.getElementById('feedingNotes').value = feeding.notes || '';
        } else {
            // Modo nuevo registro
            modalTitle.textContent = 'Nuevo Registro de Alimentación';
        }
        
        feedingModal.style.display = 'block';
    }
    
    // Función para abrir el modal de recordatorios
    function openReminderModal(reminder = null) {
        const form = document.getElementById('reminderForm');
        
        // Resetear formulario
        form.reset();
        document.getElementById('reminderId').value = '';
        
        // Configurar fecha actual por defecto
        document.getElementById('reminderDate').valueAsDate = new Date();
        
        if (reminder) {
            // Modo edición
            document.getElementById('reminderId').value = reminder.id;
            document.getElementById('reminderTitle').value = reminder.title;
            document.getElementById('reminderDate').value = reminder.date;
            document.getElementById('reminderTime').value = reminder.time;
            document.getElementById('reminderAnimalGroup').value = reminder.animalGroup;
            document.getElementById('reminderDescription').value = reminder.description || '';
            document.getElementById('reminderRepeat').value = reminder.repeat || 'once';
        }
        
        reminderModal.style.display = 'block';
    }
    
    // Función para guardar registro de alimentación
    function saveFeedingRecord() {
        const feedingId = document.getElementById('feedingId').value;
        const date = document.getElementById('feedingDate').value;
        const feedType = document.getElementById('feedType').value;
        const amount = parseFloat(document.getElementById('feedAmount').value);
        const animalGroup = document.getElementById('animalGroup').value;
        const notes = document.getElementById('feedingNotes').value;
        
        const isEditing = feedingId !== '';
        
        // Crear objeto de registro
        const feedingRecord = {
            id: isEditing ? feedingId : Date.now().toString(),
            date,
            feedType,
            amount,
            animalGroup,
            notes,
            timestamp: new Date().toISOString()
        };
        
        // Obtener registros existentes
        let feedingRecords = JSON.parse(localStorage.getItem('feedingRecords') || '[]');
        
        if (isEditing) {
            // Actualizar registro existente
            const index = feedingRecords.findIndex(t => t.id === feedingId);
            if (index !== -1) {
                feedingRecords[index] = feedingRecord;
            }
        } else {
            // Añadir nuevo registro
            feedingRecords.push(feedingRecord);
        }
        
        // Guardar en localStorage
        localStorage.setItem('feedingRecords', JSON.stringify(feedingRecords));
        
        // Actualizar la interfaz
        loadFeedingRecords();
        updateFeedingSummary();
        // Remove reference to undefined function
        // initFeedingHistoryChart();
        
        // Cerrar modal
        feedingModal.style.display = 'none';
        
        // Mostrar mensaje de éxito
        alert(`Registro ${isEditing ? 'actualizado' : 'guardado'} correctamente`);
    }
    
    // Función para guardar recordatorio
    function saveReminder() {
        const reminderId = document.getElementById('reminderId').value;
        const title = document.getElementById('reminderTitle').value;
        const date = document.getElementById('reminderDate').value;
        const time = document.getElementById('reminderTime').value;
        const animalGroup = document.getElementById('reminderAnimalGroup').value;
        const description = document.getElementById('reminderDescription').value;
        const repeat = document.getElementById('reminderRepeat').value;
        
        const isEditing = reminderId !== '';
        
        // Crear objeto de recordatorio
        const reminder = {
            id: isEditing ? reminderId : Date.now().toString(),
            title,
            date,
            time,
            animalGroup,
            description,
            repeat,
            completed: false,
            timestamp: new Date().toISOString()
        };
        
        // Obtener recordatorios existentes
        let reminders = JSON.parse(localStorage.getItem('feedingReminders') || '[]');
        
        if (isEditing) {
            // Actualizar recordatorio existente
            const index = reminders.findIndex(r => r.id === reminderId);
            if (index !== -1) {
                reminders[index] = reminder;
            }
        } else {
            // Añadir nuevo recordatorio
            reminders.push(reminder);
        }
        
        // Guardar en localStorage
        localStorage.setItem('feedingReminders', JSON.stringify(reminders));
        
        // Actualizar la interfaz
        loadReminders();
        updateFeedingSummary();
        
        // Cerrar modal
        reminderModal.style.display = 'none';
        
        // Mostrar mensaje de éxito
        alert(`Recordatorio ${isEditing ? 'actualizado' : 'guardado'} correctamente`);
    }
    
    // Función para cargar registros de alimentación
    function loadFeedingRecords() {
        const tableBody = document.getElementById('feedingTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Obtener registros de localStorage
        const feedingRecords = JSON.parse(localStorage.getItem('feedingRecords') || '[]');
        
        // Ordenar por fecha (más reciente primero)
        feedingRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (feedingRecords.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="6" class="empty-table-message">No hay registros de alimentación</td>`;
            tableBody.appendChild(emptyRow);
            return;
        }
        
        // Tipos de pienso localizados
        const feedTypes = {
            concentrado: 'Concentrado',
            forraje: 'Forraje',
            grano: 'Grano',
            pienso_especial: 'Pienso Especial',
            otro: 'Otro',
            pienso_arranque: 'Pienso de Arranque',
            paja: 'Paja'
        };
        
        // Grupos de animales localizados
        const animalGroups = {
            todos: 'Todos',
            vacuno: 'Vacuno',
            porcino: 'Porcino',
            crias: 'Crías',
            adultos: 'Adultos'
        };
        
        feedingRecords.forEach(record => {
            const row = document.createElement('tr');
            
            // Formatear fecha
            const date = new Date(record.date);
            const formattedDate = date.toLocaleDateString();
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${feedTypes[record.feedType] || record.feedType}</td>
                <td>${record.amount} kg</td>
                <td>${animalGroups[record.animalGroup] || record.animalGroup}</td>
                <td>${record.notes || '-'}</td>
                <td>
                    <button class="btn-icon edit-feeding" data-id="${record.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete delete-feeding" data-id="${record.id}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Añadir eventos a los botones de editar y eliminar
        const editButtons = document.querySelectorAll('.edit-feeding');
        const deleteButtons = document.querySelectorAll('.delete-feeding');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const recordId = this.getAttribute('data-id');
                const feedingRecords = JSON.parse(localStorage.getItem('feedingRecords') || '[]');
                const record = feedingRecords.find(t => t.id === recordId);
                
                if (record) {
                    openFeedingModal(record);
                }
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
                    const recordId = this.getAttribute('data-id');
                    let feedingRecords = JSON.parse(localStorage.getItem('feedingRecords') || '[]');
                    
                    feedingRecords = feedingRecords.filter(t => t.id !== recordId);
                    localStorage.setItem('feedingRecords', JSON.stringify(feedingRecords));
                    
                    loadFeedingRecords();
                    updateFeedingSummary();
                    // Remove reference to undefined function
                    // initFeedingHistoryChart();
                    
                    alert('Registro eliminado correctamente');
                }
            });
        });
    }
    
    // Función para cargar recordatorios
    function loadReminders() {
        const remindersContainer = document.getElementById('remindersContainer');
        if (!remindersContainer) return;
        
        remindersContainer.innerHTML = '';
        
        // Obtener recordatorios de localStorage
        const reminders = JSON.parse(localStorage.getItem('feedingReminders') || '[]');
        
        if (reminders.length === 0) {
            remindersContainer.innerHTML = '<p class="empty-list-message">No hay recordatorios configurados</p>';
            return;
        }
        
        // Ordenar por fecha (más cercana primero)
        reminders.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });
        
        // Grupos de animales localizados
        const animalGroups = {
            todos: 'Todos',
            vacuno: 'Vacuno',
            porcino: 'Porcino',
            crias: 'Crías',
            adultos: 'Adultos'
        };
        
        // Repeticiones localizadas
        const repeatTypes = {
            once: 'Una vez',
            daily: 'Diariamente',
            weekly: 'Semanalmente'
        };
        
        reminders.forEach(reminder => {
            const reminderElement = document.createElement('div');
            reminderElement.className = 'editable-block';
            
            // Comprobar si el recordatorio está próximo (en las próximas 24 horas)
            const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
            const now = new Date();
            const isUpcoming = reminderDate > now && (reminderDate - now) < 86400000; // 24 horas en milisegundos
            
            // Formatear fecha y hora
            const formattedDate = new Date(reminder.date).toLocaleDateString();
            const formattedTime = reminder.time;
            
            reminderElement.innerHTML = `
                <div class="${isUpcoming ? 'upcoming-reminder' : ''}" style="${isUpcoming ? 'background-color: rgba(255, 152, 0, 0.1);' : ''}">
                    <h4>${reminder.title} ${isUpcoming ? '<span style="color: var(--warning-color); font-size: 0.8em;">(Próximo)</span>' : ''}</h4>
                    <p><strong>Fecha y hora:</strong> ${formattedDate} a las ${formattedTime}</p>
                    <p><strong>Grupo:</strong> ${animalGroups[reminder.animalGroup] || reminder.animalGroup}</p>
                    <p><strong>Repetición:</strong> ${repeatTypes[reminder.repeat] || reminder.repeat}</p>
                    ${reminder.description ? `<p><strong>Descripción:</strong> ${reminder.description}</p>` : ''}
                    <div class="block-actions">
                        <button class="btn-icon edit-reminder" data-id="${reminder.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon mark-reminder ${reminder.completed ? 'completed' : ''}" data-id="${reminder.id}" title="${reminder.completed ? 'Marcar como pendiente' : 'Marcar como completado'}">
                            <i class="fas ${reminder.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="btn-icon btn-delete delete-reminder" data-id="${reminder.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            remindersContainer.appendChild(reminderElement);
        });
        
        // Añadir eventos a los botones de los recordatorios
        const editButtons = document.querySelectorAll('.edit-reminder');
        const markButtons = document.querySelectorAll('.mark-reminder');
        const deleteButtons = document.querySelectorAll('.delete-reminder');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const reminderId = this.getAttribute('data-id');
                const reminders = JSON.parse(localStorage.getItem('feedingReminders') || '[]');
                const reminder = reminders.find(r => r.id === reminderId);
                
                if (reminder) {
                    openReminderModal(reminder);
                }
            });
        });
        
        markButtons.forEach(button => {
            button.addEventListener('click', function() {
                const reminderId = this.getAttribute('data-id');
                let reminders = JSON.parse(localStorage.getItem('feedingReminders') || '[]');
                const index = reminders.findIndex(r => r.id === reminderId);
                
                if (index !== -1) {
                    reminders[index].completed = !reminders[index].completed;
                    localStorage.setItem('feedingReminders', JSON.stringify(reminders));
                    loadReminders();
                    updateFeedingSummary();
                }
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que quieres eliminar este recordatorio?')) {
                    const reminderId = this.getAttribute('data-id');
                    let reminders = JSON.parse(localStorage.getItem('feedingReminders') || '[]');
                    
                    reminders = reminders.filter(r => r.id !== reminderId);
                    localStorage.setItem('feedingReminders', JSON.stringify(reminders));
                    
                    loadReminders();
                    updateFeedingSummary();
                    
                    alert('Recordatorio eliminado correctamente');
                }
            });
        });
    }
    
    // Función para actualizar el resumen de alimentación
    function updateFeedingSummary() {
        const feedRemindersElement = document.getElementById('feedReminders');
        
        if (!feedRemindersElement) return;
        
        // Obtener recordatorios
        const reminders = JSON.parse(localStorage.getItem('feedingReminders') || '[]');
        const activeReminders = reminders.filter(r => !r.completed);
        
        // Actualizar elemento de recordatorios
        feedRemindersElement.textContent = activeReminders.length;
    }
    
    // Función para inicializar la calculadora de alimentación
    function initFeedingCalculator() {
        // Valores iniciales ya configurados en HTML
    }
    
    // Función para calcular la recomendación de alimentación
    function calculateFeedingRecord() {
        const animalType = document.getElementById('animalTypeCalc').value;
        const weight = parseFloat(document.getElementById('animalWeightCalc').value);
        const age = parseInt(document.getElementById('animalAgeCalc').value);
        const count = parseInt(document.getElementById('animalCountCalc').value);
        const feedType = document.getElementById('feedTypeCalc').value;
        
        if (!weight || !age) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }
        
        // Lógica de cálculo - estos valores son aproximados y deberían ajustarse
        // según recomendaciones veterinarias y zootécnicas específicas
        let feedPercentage = 0;
        
        if (animalType === 'vacuno') {
            if (feedType === 'mantenimiento') feedPercentage = 0.02;
            else if (feedType === 'engorde') feedPercentage = 0.03;
            else if (feedType === 'lactancia') feedPercentage = 0.04;
            else if (feedType === 'gestacion') feedPercentage = 0.025;
        } else if (animalType === 'porcino') {
            if (feedType === 'mantenimiento') feedPercentage = 0.025;
            else if (feedType === 'engorde') feedPercentage = 0.035;
            else if (feedType === 'lactancia') feedPercentage = 0.045;
            else if (feedType === 'gestacion') feedPercentage = 0.03;
        } else if (animalType === 'ovino' || animalType === 'caprino') {
            if (feedType === 'mantenimiento') feedPercentage = 0.02;
            else if (feedType === 'engorde') feedPercentage = 0.03;
            else if (feedType === 'lactancia') feedPercentage = 0.035;
            else if (feedType === 'gestacion') feedPercentage = 0.025;
        }
        
        // Ajustar según la edad (animales jóvenes necesitan relativamente más alimento)
        if (age < 12) {
            feedPercentage *= 1.2;
        } else if (age > 60) {
            feedPercentage *= 0.9;
        }
        
        // Calcular cantidades
        const feedPerAnimal = weight * feedPercentage;
        const feedTotalGroup = feedPerAnimal * count;
        const feedWeeklyEstimation = feedTotalGroup * 7;
        
        // Mostrar resultados
        document.getElementById('feedPerAnimal').textContent = feedPerAnimal.toFixed(2);
        document.getElementById('feedTotalGroup').textContent = feedTotalGroup.toFixed(2);
        document.getElementById('feedWeeklyEstimation').textContent = feedWeeklyEstimation.toFixed(2);
        
        // Mostrar el contenedor de resultados
        document.getElementById('feedingResultsContainer').style.display = 'block';
    }
    
    // Función para cargar consejos personalizados de alimentación
    function loadFeedingTips() {
        const animalType = document.getElementById('animalTypeCalc')?.value || 'vacuno';
        const tipsContainer = document.getElementById('feedingTips');
        if (!tipsContainer) return;
        tipsContainer.innerHTML = "";

        // Consejos de ejemplo (esto podría venir de una API o base de datos)
        const tips = {
            vacuno: [
                "Asegúrate de que el ganado tenga acceso constante a agua fresca y limpia.",
                "Equilibre la dieta con forraje y concentrado para una nutrición óptima.",
                "Monitoree el peso del ganado regularmente para ajustar la alimentación según sea necesario."
            ],
            porcino: [
                "Proporcione una dieta rica en proteínas para promover el crecimiento muscular.",
                "Asegúrese de que los cerdos tengan acceso a fibra para una digestión saludable.",
                "Evite la sobrealimentación, ya que puede conducir a problemas de salud."
            ]
        };
		const feedType = document.getElementById('feedTypeCalc')?.value || 'mantenimiento';
        const filterTips = tips[animalType]
		if (filterTips) {
			filterTips.forEach(tip => {
				const tipElement = document.createElement('li');
				tipElement.textContent = tip;
				tipsContainer.appendChild(tipElement);
			});
		} else {
			tipsContainer.textContent = "No hay consejos disponibles para el tipo de animal seleccionado.";
		}
       
    }
    
    // TAREAS
    function initTasksSection() {
        const taskList = document.getElementById('taskList');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskModal = document.getElementById('taskModal');
        const closeTaskModal = document.querySelector('.close-task-modal');
        const cancelTaskBtn = document.getElementById('cancelTask');
        const saveTaskBtn = document.getElementById('saveTask');
        const taskForm = document.getElementById('taskForm');

        // Cargar tareas desde localStorage al inicializar
        loadTasks();

        // Evento para abrir el modal de tareas
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => openTaskModal());
        }

        // Evento para cerrar el modal de tareas
        if (closeTaskModal) {
            closeTaskModal.addEventListener('click', () => closeTaskModalFn());
        }
        if (cancelTaskBtn) {
            cancelTaskBtn.addEventListener('click', () => closeTaskModalFn());
        }
        
        function closeTaskModalFn() {
            taskModal.style.display = 'none';
        }

        // Evento para guardar la tarea
        if (saveTaskBtn) {
            saveTaskBtn.addEventListener('click', () => saveTask());
        }

        // Función para cargar tareas desde localStorage
        function loadTasks() {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                addTaskToList(task);
            });
        }

        // Función para abrir el modal de tareas (crear o editar)
        function openTaskModal(task = null) {
            document.getElementById('taskId').value = '';
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            document.getElementById('taskDueDate').value = '';
            document.getElementById('taskPriority').value = 'medium';
            document.getElementById('attachmentList').innerHTML = '';
            document.getElementById('taskModalTitle').innerText = 'Crear Tarea';

            if (task) {
                document.getElementById('taskId').value = task.id;
                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskDescription').value = task.description;
                document.getElementById('taskDueDate').value = task.dueDate;
                document.getElementById('taskPriority').value = task.priority;
                task.attachments.forEach(attachment => {
                    addAttachmentToList(attachment);
                });
                document.getElementById('taskModalTitle').innerText = 'Editar Tarea';
            }

            taskModal.style.display = 'block';
        }

        // Función para guardar una tarea (crear o editar)
        function saveTask() {
            const taskId = document.getElementById('taskId').value;
            const taskTitle = document.getElementById('taskTitle').value;
            const taskDescription = document.getElementById('taskDescription').value;
            const taskDueDate = document.getElementById('taskDueDate').value;
            const taskPriority = document.getElementById('taskPriority').value;
            const isCompleted = document.getElementById('isCompleted').checked;

            const attachments = [];
            document.querySelectorAll('#attachmentList li').forEach(item => {
                attachments.push({
                    name: item.textContent.trim(),
                    url: '#'
                });
            });

            const task = {
                id: taskId ? taskId : Date.now().toString(),
                title: taskTitle,
                description: taskDescription,
                dueDate: taskDueDate,
                priority: taskPriority,
                completed: isCompleted,
                attachments: attachments
            };

            let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            if (taskId) {
                tasks = tasks.map(t => {
                    if (t.id === taskId) {
                        return task;
                    }
                    return t;
                });
            } else {
                tasks.push(task);
            }

            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
            closeTaskModalFn();
        }

        // Función para añadir una tarea a la lista en la interfaz
        function addTaskToList(task) {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.innerHTML = `
                <div class="task-info">
                    <h3>${task.title}</h3>
                    <p>Fecha límite: ${task.dueDate}</p>
                    <p>Prioridad: ${task.priority}</p>
                    </div>
                <div class="task-actions">
                    <button class="btn-icon edit-task" data-id="${task.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-task" data-id="${task.id}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                    <input type="checkbox" id="taskComplete-${task.id}" ${task.completed ? 'checked' : ''}>
                    <label for="taskComplete-${task.id}">Completada</label>
                </div>
            `;

            taskList.appendChild(taskItem);

            const completeCheckbox = taskItem.querySelector(`#taskComplete-${task.id}`);
            completeCheckbox.addEventListener('change', () => {
                task.completed = completeCheckbox.checked;
                updateTask(task);
            });

            const editButton = taskItem.querySelector('.edit-task');
            editButton.addEventListener('click', () => {
                openTaskModal(task);
            });

            const deleteButton = taskItem.querySelector('.delete-task');
            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
            });
        }

        function updateTask(task) {
            let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            tasks = tasks.map(t => {
                if (t.id === task.id) {
                    return task;
                }
                return t;
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }

        function deleteTask(id) {
            let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            tasks = tasks.filter(t => t.id !== id);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }

        const addAttachmentBtn = document.getElementById('addAttachment');
        if (addAttachmentBtn) {
            addAttachmentBtn.addEventListener('click', () => {
                const attachmentName = prompt('Nombre del archivo:');
                if (attachmentName) {
                    const attachment = {
                        name: attachmentName,
                        url: '#'
                    };
                    addAttachmentToList(attachment);
                }
            });
        }

        function addAttachmentToList(attachment) {
            const attachmentList = document.getElementById('attachmentList');
            const attachmentItem = document.createElement('li');
            attachmentItem.innerHTML = `
                <i class="fas fa-file"></i>
                ${attachment.name}
            `;
            attachmentList.appendChild(attachmentItem);

            const deleteAttachmentBtn = attachmentItem.querySelector('.delete-attachment');
            deleteAttachmentBtn.addEventListener('click', () => {
                removeAttachmentFromList(attachment.name);
            });
        }

        function removeAttachmentFromList(name) {
            const attachmentList = document.getElementById('attachmentList');
            const items = attachmentList.querySelectorAll('li');
            items.forEach(item => {
                if (item.textContent.includes(name)) {
                    attachmentList.removeChild(item);
                }
            });
        }
    }
    
    const navItemsTasks = document.querySelectorAll('.sidebar nav ul li');
    navItemsTasks.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            if (sectionId === 'tasks') {
                initTasksSection();
            }
        });
    });
    
    const inventoryGrid = document.querySelector('.inventory-grid');
    const addInventoryBtn = document.getElementById('addInventoryBtn');
    const inventoryModal = document.getElementById('inventoryModal');

    let inventoryItems = JSON.parse(localStorage.getItem('inventory')) || [];

    // Inicializar inventario
    function initInventory() {
        loadInventoryItems();
    }
    
    // Cargar items en la grid
    function loadInventoryItems() {
        inventoryGrid.innerHTML = '';
        inventoryItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'inventory-card';
            card.innerHTML = `
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="no-image">Sin imagen</div>'}
                <div class="inventory-details">
                    <h3>${item.name}</h3>
                    <div class="inventory-meta">
                        <span>Cantidad: ${item.quantity}</span>
                    </div>
                    ${item.files.length > 0 ? `
                    <div class="file-list">
                        ${item.files.map(file => `
                            <li>
                                <i class="fas fa-file"></i>
                                ${file.name}
                            </li>
                        `).join('')}
                    </div>` : ''}
                </div>
                <div class="inventory-actions">
                    <button class="btn-icon edit-inventory" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete delete-inventory" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            inventoryGrid.appendChild(card);
        });
    }
    
    // Manejar formulario de inventario
    const inventoryForm = document.getElementById('inventoryForm');
    if (inventoryForm) {
        inventoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const itemData = {
                id: document.getElementById('editItemId').value || Date.now().toString(),
                name: document.getElementById('itemName').value,
                category: document.getElementById('itemCategory').value,
                quantity: parseInt(document.getElementById('itemQuantity').value),
                image: document.getElementById('imagePreview').querySelector('img')?.src || '',
                files: Array.from(document.querySelectorAll('#attachedFiles li')).map(li => ({
                    name: li.textContent.trim(),
                    url: '#'
                }))
            };

            const editIndex = document.getElementById('editItemId').dataset.index;
            
            if (editIndex !== undefined) {
                inventoryItems[editIndex] = itemData;
            } else {
                inventoryItems.push(itemData);
            }

            localStorage.setItem('inventory', JSON.stringify(inventoryItems));
            inventoryModal.style.display = 'none';
            loadInventoryItems();
        });
    }

    // Abrir modal para nuevo/editar item
    if (addInventoryBtn) {
        addInventoryBtn.addEventListener('click', () => openInventoryModal());
    }
    document.addEventListener('click', (e) => {
        const editButton = e.target.closest('.edit-inventory');
        if (editButton && editButton.dataset.index !== undefined) {
            const index = editButton.dataset.index;
            openInventoryModal(index);
        }
    });

    function openInventoryModal(index = null) {
        const form = document.getElementById('inventoryForm');
        form.reset();
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('attachedFiles').innerHTML = '';

        if (index !== null) {
            const item = inventoryItems[index];
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemCategory').value = item.category;
            document.getElementById('itemQuantity').value = item.quantity;
            document.getElementById('editItemId').value = item.id;
            document.getElementById('editItemId').dataset.index = index;

            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                document.getElementById('imagePreview').appendChild(img);
            }

            item.files.forEach(file => {
                addFileToList(file);
            });

            document.getElementById('inventoryModalTitle').textContent = 'Editar Artículo';
        } else {
            document.getElementById('inventoryModalTitle').textContent = 'Nuevo Artículo';
        }

        inventoryModal.style.display = 'block';
    }

    // Manejar subida de imágenes
    const itemImageInput = document.getElementById('itemImage');
    if (itemImageInput) {
        itemImageInput.addEventListener('change', function(e) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = '';
            
            if (this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100%';
                    img.style.borderRadius = '8px';
                    preview.appendChild(img);
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // Manejar subida de archivos
    const inventoryFilesInput = document.getElementById('inventoryFiles');
    if (inventoryFilesInput) {
        inventoryFilesInput.addEventListener('change', function() {
            Array.from(this.files).forEach(file => {
                addFileToList(file);
            });
        });
    }

    function addFileToList(file) {
        const attachmentList = document.getElementById('attachedFiles');
        const attachmentItem = document.createElement('li');
        attachmentItem.innerHTML = `
            <i class="fas fa-file"></i>
            ${file.name}
        `;
        attachmentList.appendChild(attachmentItem);

        const deleteAttachmentBtn = attachmentItem.querySelector('.delete-attachment');
        deleteAttachmentBtn.addEventListener('click', () => {
            removeAttachmentFromList(attachment.name);
        });
    }

    // Manejar eliminación de items
    document.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-inventory');
        if (deleteButton && deleteButton.dataset.index !== undefined) {
            const index = deleteButton.dataset.index;
            if (confirm('¿Eliminar este artículo permanentemente?')) {
                inventoryItems.splice(index, 1);
                localStorage.setItem('inventory', JSON.stringify(inventoryItems));
                loadInventoryItems();
            }
        }
    });

    // Añadir al listener principal
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            if (sectionId === 'inventory') {
                initInventory();
            }
        });
    });
    
    // Inicializar informes personalizados
    const reportPeriod = document.getElementById('reportPeriod');
    const customDateRange = document.getElementById('customDateRange');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const exportReportBtn = document.getElementById('exportReportBtn');
    
    if (reportPeriod) {
        reportPeriod.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateRange.style.display = 'flex';
            } else {
                customDateRange.style.display = 'none';
            }
        });
    }
    
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            const reportType = document.getElementById('reportType').value;
            const resultContainer = document.getElementById('customReportResult');
            
            resultContainer.innerHTML = '<p>Generando informe...</p>';
            
            // Simulación de generación de informe (en una aplicación real, esto haría una llamada AJAX)
            setTimeout(() => {
                resultContainer.innerHTML = `
                    <h3>Informe ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}</h3>
                    <div class="chart-container" style="height: 250px;">
                        <canvas id="customReportChart"></canvas>
                    </div>
                    <div style="margin-top: 20px;">
                        <h4>Resumen de datos</h4>
                        <p>Este es un resumen generado según los parámetros seleccionados. En una implementación real, estos datos se obtendrían de la base de datos.</p>
                        <ul style="margin-top: 10px;">
                            <li>Total de registros: 247</li>
                            <li>Periodo analizado: Último ${reportPeriod.value === 'month' ? 'mes' : reportPeriod.value === 'quarter' ? 'trimestre' : 'año'}</li>
                            <li>Fecha de generación: ${new Date().toLocaleDateString()}</li>
                        </ul>
                    </div>
                `;
                
                // Inicializar gráfico
                const ctx = document.getElementById('customReportChart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                        datasets: [{
                            label: 'Datos de ejemplo',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Mes'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Importe (€)'
                                },
                                beginAtZero: true
                            }
                        }
                    }
                });
            }, 1000);
        });
    }
    
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            alert('Funcionalidad de exportación a PDF. En una implementación real, esto generaría un PDF con los datos del informe.');
        });
    }

    // Variables para el modal de stock
    const editStockBtn = document.getElementById('editStockBtn');
    const stockModal = document.getElementById('stockModal');
    const closeStockModal = stockModal?.querySelector('.close-modal');
    const cancelStockBtn = document.getElementById('cancelStock');
    const stockForm = document.getElementById('stockForm');
    
    // Eventos para editar stock
    if (editStockBtn) {
        editStockBtn.addEventListener('click', function() {
            openStockModal();
        });
    }
    
    if (closeStockModal) {
        closeStockModal.addEventListener('click', function() {
            stockModal.style.display = 'none';
        });
    }
    
    if (cancelStockBtn) {
        cancelStockBtn.addEventListener('click', function() {
            stockModal.style.display = 'none';
        });
    }
    
    // Función para abrir el modal de stock
    function openStockModal() {
        // Obtener stock actual
        const feedStock = parseFloat(document.getElementById('feedStock').textContent);
        document.getElementById('currentStock').value = feedStock > 0 ? feedStock : 0;
        document.getElementById('newStock').value = '';
        document.getElementById('stockNotes').value = '';
        
        stockModal.style.display = 'block';
    }
    
    // Manejar envío del formulario de stock
    if (stockForm) {
        stockForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentStock = parseFloat(document.getElementById('currentStock').value) || 0;
            const newStock = parseFloat(document.getElementById('newStock').value) || 0;
            const totalStock = currentStock + newStock;
            const notes = document.getElementById('stockNotes').value;
            
            // Guardar en localStorage
            localStorage.setItem('feedStock', totalStock.toString());
            
            // Actualizar interfaz
            document.getElementById('feedStock').textContent = `${totalStock.toFixed(1)} kg`;
            
            // Cambiar color según nivel de stock
            const feedStockElement = document.getElementById('feedStock');
            if (totalStock < 200) {
                feedStockElement.style.color = 'var(--danger-color)';
            } else if (totalStock < 500) {
                feedStockElement.style.color = 'var(--warning-color)';
            } else {
                feedStockElement.style.color = '';
            }
            
            // Guardar archivo si existe
            const stockFile = document.getElementById('stockFile').files[0];
            if (stockFile) {
                // En una implementación real, aquí se subiría el archivo a un servidor
                // Para esta demo, solo mostraremos un mensaje
                console.log('Archivo relacionado con stock:', stockFile.name);
            }
            
            // Cerrar modal
            stockModal.style.display = 'none';
            
            alert('Stock actualizado correctamente');
        });
    }
    
    // Expose feeding functions to global scope so they can be used in initFeedingSection
    window.loadFeedingRecords = loadFeedingRecords;
    window.updateFeedingSummary = updateFeedingSummary;
    window.loadReminders = loadReminders;
    window.loadFeedingTips = loadFeedingTips;
    window.initFeedingSection = function() {
         loadFeedingRecords();
         updateFeedingSummary();
         loadReminders();
         loadFeedingTips();
    };

    // ... existing code ...

    // Función para inicializar la sección de configuración
    function initSettingsSection() {
        loadSavedSettings();

        // Modal para cambiar contraseña
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const passwordModal = document.getElementById('passwordModal');
        const closePasswordModal = passwordModal.querySelector('.close-modal');
        const cancelPasswordBtn = document.getElementById('cancelPasswordChange');
        const passwordForm = document.getElementById('passwordForm');

        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', function() {
                passwordModal.style.display = 'block';
            });
        }
        if (closePasswordModal) {
            closePasswordModal.addEventListener('click', function() {
                passwordModal.style.display = 'none';
            });
        }
        if (cancelPasswordBtn) {
            cancelPasswordBtn.addEventListener('click', function() {
                passwordModal.style.display = 'none';
            });
        }
        window.addEventListener('click', function(event) {
            if (event.target === passwordModal) {
                passwordModal.style.display = 'none';
            }
        });
        if (passwordForm) {
            passwordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                if (newPassword !== confirmPassword) {
                    alert('Las contraseñas no coinciden');
                    return;
                }
                updateSettingsBackend('/api/changePassword', { currentPassword, newPassword })
                  .then(response => {
                      if (response.status === 'success') {
                          alert('Contraseña cambiada correctamente');
                          passwordModal.style.display = 'none';
                          passwordForm.reset();
                      } else {
                          alert('Error al cambiar la contraseña');
                      }
                  })
                  .catch(err => console.error(err));
            });
        }

        // Gestión de apariencia: tipografía y color principal
        const fontSelector = document.getElementById('fontSelector');
        const fontPreview = document.getElementById('fontPreview');
        if (fontSelector && fontPreview) {
            fontSelector.addEventListener('change', function() {
                fontPreview.style.fontFamily = this.value;
            });
            const applyFontBtn = document.getElementById('applyFontBtn');
            if (applyFontBtn) {
                applyFontBtn.addEventListener('click', function() {
                    const selectedFont = fontSelector.value;
                    // Extrae el nombre de la fuente removiendo comillas y obteniendo la primera parte
                    let fontName = selectedFont.split(',')[0].replace(/['"]/g, '');
                    // Lista de fuentes Google que se cargarán dinámicamente
                    const googleFonts = ["Roboto", "Open Sans", "Lato", "Montserrat", "Nunito"];
                    if (googleFonts.includes(fontName)) {
                        WebFont.load({
                            google: {
                                families: [fontName]
                            },
                            active: function() {
                                document.documentElement.style.setProperty('--font-family', selectedFont);
                                localStorage.setItem('appFontFamily', selectedFont);
                                alert('Tipografía cambiada correctamente');
                            },
                            inactive: function() {
                                // Si falla la carga, se aplica la fuente de todos modos
                                document.documentElement.style.setProperty('--font-family', selectedFont);
                                localStorage.setItem('appFontFamily', selectedFont);
                                alert('Tipografía cambiada (carga fallida)');
                            }
                        });
                    } else {
                        document.documentElement.style.setProperty('--font-family', selectedFont);
                        localStorage.setItem('appFontFamily', selectedFont);
                        alert('Tipografía cambiada correctamente');
                    }
                });
            }
        }
        const primaryColorPicker = document.getElementById('primaryColorPicker');
        if (primaryColorPicker) {
            primaryColorPicker.addEventListener('change', function() {
                const color = this.value;
                updateSettingsBackend('/api/appearance', { type: 'primaryColor', value: color })
                  .then(response => {
                      if (response.status === 'success') {
                          document.documentElement.style.setProperty('--primary-color', color);
                          localStorage.setItem('appPrimaryColor', color);
                      } else {
                          alert('Error al cambiar el color principal');
                      }
                  })
                  .catch(err => console.error(err));
            });
        }
        const resetAppearanceBtn = document.getElementById('resetAppearanceBtn');
        if (resetAppearanceBtn) {
            resetAppearanceBtn.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que quieres restablecer la apariencia a los valores predeterminados?')) {
                    updateSettingsBackend('/api/appearance/reset', {})
                      .then(response => {
                          if (response.status === 'success') {
                              document.documentElement.style.setProperty('--font-family', '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif');
                              fontSelector.value = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
                              fontPreview.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
                              document.documentElement.style.setProperty('--primary-color', '#4caf50');
                              primaryColorPicker.value = '#4caf50';
                              document.getElementById('fontSizeSelector').value = 'medium';
                              document.getElementById('themeSelector').value = 'light';
                              localStorage.removeItem('appFontFamily');
                              localStorage.removeItem('appPrimaryColor');
                              localStorage.removeItem('appFontSize');
                              localStorage.removeItem('appTheme');
                              alert('Apariencia restablecida a los valores predeterminados');
                          } else {
                              alert('Error al restablecer la apariencia');
                          }
                      })
                      .catch(err => console.error(err));
                }
            });
        }

        // Guardar datos del usuario (nombre, correo)
        const saveAccountBtn = document.getElementById('saveAccountBtn');
        if (saveAccountBtn) {
            saveAccountBtn.addEventListener('click', function() {
                const userName = document.getElementById('userName').value;
                const userEmail = document.getElementById('userEmail').value;
                if (!userName || !userEmail) {
                    alert('Por favor, rellena todos los campos obligatorios');
                    return;
                }
                updateSettingsBackend('/api/user', { userName, userEmail })
                  .then(response => {
                      if (response.status === 'success') {
                          localStorage.setItem('userName', userName);
                          localStorage.setItem('userEmail', userEmail);
                          alert('Datos de cuenta guardados correctamente');
                      } else {
                          alert('Error al guardar datos de cuenta');
                      }
                  })
                  .catch(err => console.error(err));
            });
        }

        // Guardar configuración regional (idioma, formato de fecha y moneda)
        const saveRegionalBtn = document.getElementById('saveRegionalBtn');
        if (saveRegionalBtn) {
            saveRegionalBtn.addEventListener('click', function() {
                const language = document.getElementById('languageSelector').value;
                const dateFormat = document.getElementById('dateFormatSelector').value;
                const currency = document.getElementById('currencySelector').value;
                updateSettingsBackend('/api/regionalSettings', { language, dateFormat, currency })
                  .then(response => {
                      if (response.status === 'success') {
                          localStorage.setItem('appLanguage', language);
                          localStorage.setItem('appDateFormat', dateFormat);
                          localStorage.setItem('appCurrency', currency);
                          alert('Configuración regional guardada correctamente');
                      } else {
                          alert('Error al guardar la configuración regional');
                      }
                  })
                  .catch(err => console.error(err));
            });
        }

        // Guardar configuración de notificaciones
        const saveNotificationsBtn = document.getElementById('saveNotificationsBtn');
        if (saveNotificationsBtn) {
            saveNotificationsBtn.addEventListener('click', function() {
                const emailNotifications = document.getElementById('emailNotifications').checked;
                const taskReminders = document.getElementById('taskReminders').checked;
                const feedingAlerts = document.getElementById('feedingAlerts').checked;
                const lowStockAlerts = document.getElementById('lowStockAlerts').checked;
                updateSettingsBackend('/api/notifications', { emailNotifications, taskReminders, feedingAlerts, lowStockAlerts })
                  .then(response => {
                      if (response.status === 'success') {
                          localStorage.setItem('emailNotifications', emailNotifications);
                          localStorage.setItem('taskReminders', taskReminders);
                          localStorage.setItem('feedingAlerts', feedingAlerts);
                          localStorage.setItem('lowStockAlerts', lowStockAlerts);
                          alert('Configuración de notificaciones guardada correctamente');
                      } else {
                          alert('Error al guardar configuración de notificaciones');
                      }
                  })
                  .catch(err => console.error(err));
            });
        }

        // Guardar configuración de privacidad (sincronización, análisis de uso)
        const savePrivacyBtn = document.getElementById('savePrivacyBtn');
        if (savePrivacyBtn) {
            savePrivacyBtn.addEventListener('click', function() {
                const localStorageToggle = document.getElementById('localStorageToggle').checked;
                const cloudSyncToggle = document.getElementById('cloudSyncToggle').checked;
                const analyticsToggle = document.getElementById('analyticsToggle').checked;
                updateSettingsBackend('/api/privacy', { localStorageEnabled: localStorageToggle, cloudSyncEnabled: cloudSyncToggle, analyticsEnabled: analyticsToggle })
                  .then(response => {
                      if (response.status === 'success') {
                          localStorage.setItem('localStorageEnabled', localStorageToggle);
                          localStorage.setItem('cloudSyncEnabled', cloudSyncToggle);
                          localStorage.setItem('analyticsEnabled', analyticsToggle);
                          alert('Configuración de privacidad guardada correctamente');
                      } else {
                          alert('Error al guardar configuración de privacidad');
                      }
                  })
                  .catch(err => console.error(err));
            });
        }

        // Guardar configuración general (página inicial, auto-guardado, etc.)
        const saveGeneralBtn = document.getElementById('saveGeneralBtn');
        if (saveGeneralBtn) {
            saveGeneralBtn.addEventListener('click', function() {
                const startupSection = document.getElementById('startupSection').value;
                const dataSaverMode = document.getElementById('dataSaverMode').checked;
                const autoSaveToggle = document.getElementById('autoSaveToggle').checked;
                updateSettingsBackend('/api/general', { startupSection, dataSaverMode, autoSaveEnabled: autoSaveToggle })
                  .then(response => {
                      if (response.status === 'success') {
                          localStorage.setItem('startupSection', startupSection);
                          localStorage.setItem('dataSaverMode', dataSaverMode);
                          localStorage.setItem('autoSaveEnabled', autoSaveToggle);
                          alert('Configuración general guardada correctamente');
                      } else {
                          alert('Error al guardar configuración general');
                      }
                  })
                  .catch(err => console.error(err));
            });
        }
        
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', function() {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser) {
                    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta permanentemente? Esta acción eliminará todos tus datos y no se podrá recuperar.')) {
                        // Eliminar usuario de la lista de usuarios
                        let users = JSON.parse(localStorage.getItem('users') || '[]');
                        users = users.filter(u => u.email !== currentUser.email);
                        localStorage.setItem('users', JSON.stringify(users));
                        
                        // Eliminar todos los datos del usuario
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('animals');
                        localStorage.removeItem('financeTransactions');
                        localStorage.removeItem('financeBudgets');
                        localStorage.removeItem('feedingRecords');
                        localStorage.removeItem('tasks');
                        localStorage.removeItem('activities');
                        localStorage.removeItem('inventory');
                        
                        // Redirigir al login
                        checkLoginStatus();
                        alert('Cuenta eliminada correctamente');
                    }
                }
            });
        }
    }
    
    // Función para cargar configuraciones guardadas
    function loadSavedSettings() {
        // Cargar tipografía
        const savedFont = localStorage.getItem('appFontFamily');
        if (savedFont) {
            document.documentElement.style.setProperty('--font-family', savedFont);
            const fontSelector = document.getElementById('fontSelector');
            if (fontSelector) {
                fontSelector.value = savedFont;
                const fontPreview = document.getElementById('fontPreview');
                if (fontPreview) {
                    fontPreview.style.fontFamily = savedFont;
                }
            }
        }
        
        // Cargar color principal
        const savedColor = localStorage.getItem('appPrimaryColor');
        if (savedColor) {
            document.documentElement.style.setProperty('--primary-color', savedColor);
            const colorPicker = document.getElementById('primaryColorPicker');
            if (colorPicker) {
                colorPicker.value = savedColor;
            }
        }
        
        // Cargar datos de usuario
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        
        if (userName) {
            const userNameInput = document.getElementById('userName');
            if (userNameInput) {
                userNameInput.value = userName;
            }
        }
        
        if (userEmail) {
            const userEmailInput = document.getElementById('userEmail');
            if (userEmailInput) {
                userEmailInput.value = userEmail;
            }
        }
        
        // Cargar configuración regional
        const language = localStorage.getItem('appLanguage');
        const dateFormat = localStorage.getItem('appDateFormat');
        const currency = localStorage.getItem('appCurrency');
        
        if (language) {
            const languageSelector = document.getElementById('languageSelector');
            if (languageSelector) {
                languageSelector.value = language;
            }
        }
        
        if (dateFormat) {
            const dateFormatSelector = document.getElementById('dateFormatSelector');
            if (dateFormatSelector) {
                dateFormatSelector.value = dateFormat;
            }
        }
        
        if (currency) {
            const currencySelector = document.getElementById('currencySelector');
            if (currencySelector) {
                currencySelector.value = currency;
            }
        }
        
        // Cargar configuración de notificaciones
        const loadToggleSetting = (settingId, storageKey, defaultValue = true) => {
            const value = localStorage.getItem(storageKey);
            const element = document.getElementById(settingId);
            if (element) {
                element.checked = value === null ? defaultValue : value === 'true';
            }
        };
        
        loadToggleSetting('emailNotifications', 'emailNotifications');
        loadToggleSetting('taskReminders', 'taskReminders');
        loadToggleSetting('feedingAlerts', 'feedingAlerts');
        loadToggleSetting('lowStockAlerts', 'lowStockAlerts');
        
        // Cargar configuración de privacidad
        loadToggleSetting('localStorageToggle', 'localStorageEnabled');
        loadToggleSetting('cloudSyncToggle', 'cloudSyncEnabled', false);
        loadToggleSetting('analyticsToggle', 'analyticsEnabled');
        
        // Cargar configuración general
        const startupSection = localStorage.getItem('startupSection');
        if (startupSection) {
            const startupSelector = document.getElementById('startupSection');
            if (startupSelector) {
                startupSelector.value = startupSection;
            }
        }
        
        loadToggleSetting('dataSaverMode', 'dataSaverMode', false);
        loadToggleSetting('autoSaveToggle', 'autoSaveEnabled');
    }

    // Aplicar el tema guardado
    function applyTheme() {
        const savedTheme = localStorage.getItem('appTheme') || 'light';
        document.body.className = savedTheme === 'dark' ? 'dark-theme' : '';

        const themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            themeSelector.value = savedTheme;
        }
    }

    const themeSelector = document.getElementById('themeSelector');

    if (themeSelector) {
        themeSelector.addEventListener('change', function() {
            const selectedTheme = this.value;
            document.body.className = selectedTheme === 'dark' ? 'dark-theme' : '';
            localStorage.setItem('appTheme', selectedTheme);
        });
    }
    
    // Añadir inicialización de configuración al navegador
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            if (sectionId === 'settings') {
                initSettingsSection();
            }
        });
    });
});

// Agregar helper para simular conexión con backend
function updateSettingsBackend(endpoint, data) {
  console.log('Simulating backend update to', endpoint, data);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: 'success' }), 500);
  });
}

function initFeedingSection() {
    loadFeedingRecords();
    updateFeedingSummary();
    loadReminders();
    loadFeedingTips();
}

// Se elimina la función initFeedingHistoryChart()

function initActivitiesSection() {
    const activityList = document.getElementById('activitiesTableBody');
    const addActivityBtn = document.getElementById('addActivityBtn');
    const activityModal = document.getElementById('activityModal');
    const closeActivityModal = document.querySelector('.close-modal');
    const cancelActivityBtn = document.getElementById('cancelActivity');
    const activityForm = document.getElementById('activityForm');
    const responsibleFilter = document.getElementById('activityResponsibleFilter');
    
    loadActivities();
    
    // Eventos para abrir/cerrar modal
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', function() {
            openActivityModal();
        });
    }
    
    if (closeActivityModal) {
        closeActivityModal.addEventListener('click', function() {
            activityModal.style.display = 'none';
        });
    }
    
    if (cancelActivityBtn) {
        cancelActivityBtn.addEventListener('click', function() {
            activityModal.style.display = 'none';
        });
    }
    
    // Cerrar modal haciendo clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === activityModal) {
            activityModal.style.display = 'none';
        }
    });
    
    // Envío del formulario
    if (activityForm) {
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveActivity();
        });
    }
    
    // Filtrar por responsable
    if (responsibleFilter) {
        responsibleFilter.addEventListener('change', function() {
            filterActivities();
        });
    }
}

// Cargar actividades desde localStorage
function loadActivities() {
    const activityList = document.getElementById('activitiesTableBody');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    // Obtener actividades guardadas
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    
    if (activities.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="6" class="empty-table-message">No hay actividades registradas</td>`;
        activityList.appendChild(emptyRow);
        return;
    }
    
    // Ordenar por fecha límite (más próximas primero)
    activities.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    activities.forEach(activity => {
        addActivityToTable(activity);
    });
}

// Añadir una actividad a la tabla
function addActivityToTable(activity) {
    document.querySelectorAll('.activity-item').forEach((item) => {
        item.remove();
    });
    const activityList = document.getElementById('activitiesTableBody');
    if (!activityList) return;
    
    const row = document.createElement('tr');
    
    // Calcular si está vencida
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(activity.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const isOverdue = dueDate < today && !activity.completed;
    
    // Formatear fecha
    const formattedDate = new Date(activity.dueDate).toLocaleDateString();
    
    // Determinar el estado
    let statusText = '';
    let statusClass = '';
    
    if (activity.completed) {
        statusText = 'Completada';
        statusClass = 'amount-positive';
    } else if (isOverdue) {
        statusText = 'Vencida';
        statusClass = 'amount-negative';
    } else {
        statusText = 'Pendiente';
        statusClass = '';
    }
    
    row.innerHTML = `
        <td>${activity.name}</td>
        <td>${activity.description || '-'}</td>
        <td>${formattedDate}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>
            <button class="btn-icon edit-activity" data-id="${activity.id}" title="Editar">
                <i class="fas fa-edit"></i>
                        </button>
            <button class="btn-icon delete-activity" data-id="${activity.id}" title="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
            <button class="btn-icon complete-activity" data-id="${activity.id}" title="${activity.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                <i class="fas ${activity.completed ? 'fa-undo' : 'fa-check'}"></i>
            </button>
        </td>
    `;
    
    activityList.appendChild(row);
    
    // Añadir eventos a los botones
    const editBtn = row.querySelector('.edit-activity');
    const deleteBtn = row.querySelector('.delete-activity');
    const completeBtn = row.querySelector('.complete-activity');
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const activityId = this.getAttribute('data-id');
            const activities = JSON.parse(localStorage.getItem('activities') || '[]');
            const activity = activities.find(a => a.id === activityId);
            
            if (activity) {
                openActivityModal(activity);
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
                const activityId = this.getAttribute('data-id');
                deleteActivity(activityId);
            }
        });
    }
    
    if (completeBtn) {
        completeBtn.addEventListener('click', function() {
            const activityId = this.getAttribute('data-id');
            toggleActivityStatus(activityId);
        });
    }
}

// Abrir modal para crear/editar actividad
function openActivityModal(activity = null) {
    const activityModal = document.getElementById('activityModal');
    const modalTitle = document.getElementById('activityModalTitle');
    const form = document.getElementById('activityForm');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('activityId').value = '';
    
    // Establecer fecha actual como mínima
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('activityDueDate').min = today;
    
    if (activity) {
        // Modo edición
        modalTitle.textContent = 'Editar Actividad';
        document.getElementById('activityId').value = activity.id;
        document.getElementById('activityName').value = activity.name;
        document.getElementById('activityDescription').value = activity.description || '';
        document.getElementById('activityDueDate').value = activity.dueDate;
        document.getElementById('activityCompleted').checked = activity.completed;
    } else {
        // Modo nueva actividad
        modalTitle.textContent = 'Nuevo Actividad';
        document.getElementById('activityDueDate').valueAsDate = new Date();
    }
    
    activityModal.style.display = 'block';
}

// Guardar actividad
function saveActivity() {
    const activityId = document.getElementById('activityId').value;
    const name = document.getElementById('activityName').value;
    const description = document.getElementById('activityDescription').value;
    const dueDate = document.getElementById('activityDueDate').value;
    const completed = document.getElementById('activityCompleted').checked;
    
    const isEditing = activityId !== '';
    
    // Crear objeto de actividad
    const activity = {
        id: isEditing ? activityId : Date.now().toString(),
        name,
        description,
        dueDate,
        completed,
        timestamp: new Date().toISOString()
    };
    
    // Obtener actividades existentes
    let activities = JSON.parse(localStorage.getItem('activities') || '[]');
    
    if (isEditing) {
        // Actualizar actividad existente
        const index = activities.findIndex(a => a.id === activityId);
        if (index !== -1) {
            activities[index] = activity;
        }
    } else {
        // Añadir nueva actividad
        activities.push(activity);
    }
    
    // Guardar en localStorage
    localStorage.setItem('activities', JSON.stringify(activities));
    
    // Actualizar la interfaz
    loadActivities();
    
    // Cerrar modal
    document.getElementById('activityModal').style.display = 'none';
    
    // Mostrar mensaje de éxito
    alert(`Actividad ${isEditing ? 'actualizada' : 'guardada'} correctamente`);
}

// Eliminar actividad
function deleteActivity(activityId) {
    let activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities = activities.filter(a => a.id !== activityId);
    localStorage.setItem('activities', JSON.stringify(activities));
    loadActivities();
    alert('Actividad eliminada correctamente');
}

// Cambiar estado de la actividad (completada/pendiente)
function toggleActivityStatus(activityId) {
    let activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const index = activities.findIndex(a => a.id === activityId);
    
    if (index !== -1) {
        activities[index].completed = !activities[index].completed;
        localStorage.setItem('activities', JSON.stringify(activities));
        loadActivities();
    }
}

// Filtrar actividades
function filterActivities() {
    const responsibleFilter = document.getElementById('activityResponsibleFilter').value;
    
    let activities = JSON.parse(localStorage.getItem('activities') || '[]');
    
    // Aplicar filtros
    const filteredActivities = activities.filter(activity => {
        // Filtro por responsable
        const matchesResponsible = responsibleFilter === 'all' || activity.responsible === responsibleFilter;
        
        return matchesResponsible;
    });
    
    // Limpiar tabla
    const activityList = document.getElementById('activitiesTableBody');
    activityList.innerHTML = '';
    
    // Mostrar mensaje si no hay resultados
    if (filteredActivities.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="6" class="empty-table-message">No se encontraron actividades que coincidan con los filtros</td>`;
        activityList.appendChild(emptyRow);
        return;
    }
    
    // Ordenar por fecha límite
    filteredActivities.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    // Mostrar actividades filtradas
    filteredActivities.forEach(activity => {
        addActivityToTable(activity);
    });
}

function clearAllAnimals() {
    if (confirm("¿Está seguro de que desea borrar todos los registros de animales?")) {
        localStorage.removeItem('animals'); // Clear from localstorage too
        const animalCards = document.querySelector('#birthRegistration .animal-cards');
        if (animalCards) {
            animalCards.innerHTML = "";
        }
        updateHomeStats();
        alert("Registros de animales borrados.");
    }
}

function clearAllFeedingRecords() {
    if (confirm("¿Está seguro de que desea borrar todos los registros de alimentación?")) {
        localStorage.removeItem('feedingRecords');
        loadFeedingRecords();
        alert("Registros de alimentación borrados.");
    }
}

function clearAllFinancesRecords() {
    if (confirm("¿Está seguro de que desea borrar todos los registros financieros (transacciones y presupuestos)?")) {
        localStorage.removeItem('financeTransactions');
        localStorage.removeItem('financeBudgets');
        loadTransactions();
        loadBudgets();
        updateFinancialSummary();
        alert("Registros financieros borrados.");
    }
}

function clearAllActivitiesRecords() {
    if (confirm("¿Está seguro de que desea borrar todos los registros de actividades?")) {
        localStorage.removeItem('activities');
        loadActivities();
        alert("Registros de actividades borrados.");
    }
}

function clearAllInventoryRecords() {
    if (confirm("¿Está seguro de que desea borrar todos los registros de inventario?")) {
        localStorage.removeItem('inventory');
        loadInventoryItems();
        alert("Registros de inventario borrados.");
    }
}

function clearAllReportsRecords() {
    if (confirm("¿Está seguro de que desea borrar todos los registros de informes?")) {
        const pacFilesList = document.getElementById('pacFilesList');
        if (pacFilesList) {
            pacFilesList.innerHTML = '<p class="empty-list-message">No hay archivos subidos. Usa el botón "Subir Archivos" para añadir documentación.</p>';
        }
        const guiasFilesList = document.getElementById('guiasFilesList');
        if (guiasFilesList) {
            guiasFilesList.innerHTML = '<p class="empty-list-message">No hay guías registradas. Usa el botón "Subir Guía" para añadir documentación.</p>';
        }
        localStorage.removeItem('recentContentUpdates');
        localStorage.removeItem('pacFiles');
        localStorage.removeItem('guiaFiles');
        alert("Registros de informes borrados.");
    }
}

const deleteAllAnimalsBtn = document.getElementById('deleteAllAnimalsBtn');
if (deleteAllAnimalsBtn) {
    deleteAllAnimalsBtn.addEventListener('click', clearAllAnimals);
}

const deleteAllFeedingBtn = document.getElementById('deleteAllFeedingBtn');
if (deleteAllFeedingBtn) {
    deleteAllFeedingBtn.addEventListener('click', clearAllFeedingRecords);
}

const deleteAllFinancesBtn = document.getElementById('deleteAllFinancesBtn');
if (deleteAllFinancesBtn) {
    deleteAllFinancesBtn.addEventListener('click', clearAllFinancesRecords);
}

const deleteAllActivitiesBtn = document.getElementById('deleteAllActivitiesBtn');
if (deleteAllActivitiesBtn) {
    deleteAllActivitiesBtn.addEventListener('click', clearAllActivitiesRecords);
}

const deleteAllInventoryBtn = document.getElementById('deleteAllInventoryBtn');
if (deleteAllInventoryBtn) {
    deleteAllInventoryBtn.addEventListener('click', clearAllInventoryRecords);
}

const deleteAllReportsBtn = document.getElementById('deleteAllReportsBtn');
if (deleteAllReportsBtn) {
    deleteAllReportsBtn.addEventListener('click', clearAllReportsRecords);
}

function loadAllAnimalRecords() {
    const allRecordsContainer = document.querySelector('#allRecords .animal-cards');
    if (!allRecordsContainer) return;
    
    // Clear current content
    allRecordsContainer.innerHTML = '';
    
    // Get all animal cards from both regular animals and birth registrations
    const regularAnimalCards = document.querySelectorAll('#newAnimal .animal-card');
    const birthRegistrationCards = document.querySelectorAll('#birthRegistration .animal-card');
    
    // Create array from NodeLists and combine
    const allAnimals = [...Array.from(regularAnimalCards), ...Array.from(birthRegistrationCards)];
    
    if (allAnimals.length === 0) {
        allRecordsContainer.innerHTML = '<p class="empty-list-message">No hay registros de animales</p>';
        return;
    }
    
    // Clone and append each card to the all records container
    allAnimals.forEach(card => {
        const cardClone = card.cloneNode(true);
        allRecordsContainer.appendChild(cardClone);
    });
    
    // Add click event to the export button if it's present
    const exportBtn = document.getElementById('exportAllAnimalsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAllAnimals);
    }
}

// Function to export all animal records
function exportAllAnimals() {
    // Get all animal data
    const regularAnimalCards = document.querySelectorAll('#newAnimal .animal-card');
    const birthRegistrationCards = document.querySelectorAll('#birthRegistration .animal-card');
    
    // Create array to hold all animal data
    const allAnimalsData = [];
    
    // Process regular animals
    regularAnimalCards.forEach(card => {
        const animalData = extractAnimalDataFromCard(card, 'regular');
        allAnimalsData.push(animalData);
    });
    
    // Process birth registrations
    birthRegistrationCards.forEach(card => {
        const animalData = extractAnimalDataFromCard(card, 'birth');
        allAnimalsData.push(animalData);
    });
    
    if (allAnimalsData.length === 0) {
        alert('No hay registros de animales para exportar.');
        return;
    }
    
    // Convert to JSON
    const dataStr = JSON.stringify(allAnimalsData, null, 2);
    
    // Create download link
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = 'registros_animales_' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.style.display = 'none';
    
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    
    alert('Registros exportados correctamente.');
}

function extractAnimalDataFromCard(card, type) {
    // Extract data from a card element
    const animalData = {
        type: type,
        id: card.querySelector('h3').textContent.replace('ID: ', ''),
        fields: {}
    };
    
    // Get all paragraphs with animal info
    const paragraphs = card.querySelectorAll('.animal-info p');
    paragraphs.forEach(p => {
        const text = p.textContent;
        const parts = text.split(':');
        
        if (parts.length >= 2) {
            const key = parts[0].trim().toLowerCase().replace(/\s+/g, '_');
            let value = parts.slice(1).join(':').trim();
            
            // Clean up some common values
            if (value.endsWith(' kg')) {
                value = value.replace(' kg', '');
            } else if (value.endsWith(' años')) {
                value = value.replace(' años', '');
            }
            
            animalData.fields[key] = value;
        }
    });
    
    return animalData;
}

const animalTabBtns = document.querySelectorAll('#animals .tab-btn');
const animalTabContents = document.querySelectorAll('#animals .tab-content');

if (animalTabBtns.length > 0) {
    animalTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons
            animalTabBtns.forEach(button => button.classList.remove('active'));
            // Add active to clicked button
            this.classList.add('active');
            
            // Hide all contents
            animalTabContents.forEach(content => content.classList.remove('active'));
            
            // Show selected content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // If all records tab is selected, load all records
            if (tabId === 'allRecords') {
                loadAllAnimalRecords();
            }
        });
    });
}

function updateAllRecordsTab() {
    const allRecordsTab = document.getElementById('allRecords');
    if (allRecordsTab && allRecordsTab.classList.contains('active')) {
        loadAllAnimalRecords();
    }
}

function initAnimalCardListeners(card) {
    if (!card) return;
    
    const deleteBtn = card.querySelector('.delete-animal');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.getAttribute('data-id') || card.id;
            if (id) {
                deleteAnimal(id);
            }
        });
    }
    
    const editBtn = card.querySelector('.edit-animal, .edit-birth');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Edit functionality handled in the card click event
        });
    }
    
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.btn-icon') && !e.target.closest('.animal-actions')) {
            // Functionality to show animal details
            const id = card.id;
            const animalData = getAnimalById(id);
            if (animalData) {
                if (animalData.type === 'birth') {
                    openBirthEditModal(animalData);
                } else {
                    openAnimalEditModal(animalData);
                }
            }
        }
    });
}

// Add helper function to get animal by ID
function getAnimalById(id) {
    if (!id) return null;
    
    const animals = JSON.parse(localStorage.getItem('animals') || '[]');
    return animals.find(animal => animal.id === id) || null;
}

// ... existing code ...

function loadFincasInSelectors() {
    const fincas = JSON.parse(localStorage.getItem('fincas') || '[]');
    const selects = document.querySelectorAll('#animalFinca, #birthFinca');
    
    selects.forEach(select => {
        // Clear existing options except placeholder
        while(select.options.length > 1) {
            select.remove(1);
        }
        
        // Add new options
        fincas.forEach(finca => {
            const option = document.createElement('option');
            option.value = finca.name;
            option.textContent = finca.name;
            select.appendChild(option);
        });
    });
}

// Update finca form submission handler to call this function
const fincaForm = document.getElementById('fincaForm');
if (fincaForm) {
    fincaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ... existing submission logic ...
        
        // After saving finca
        loadFincasInSelectors();
        loadFincas(); // Refresh fincas grid
    });
}