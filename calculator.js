// Telegram Web App Integration
let tg = null;

// Initialize Telegram Web App
function initTelegramApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        // Apply Telegram theme
        document.body.classList.add('tg-app');
        
        // Set up theme change listener
        tg.onEvent('themeChanged', () => {
            applyTelegramTheme();
        });
        
        applyTelegramTheme();
    }
}

// Apply Telegram theme colors
function applyTelegramTheme() {
    if (tg) {
        const root = document.documentElement;
        root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
        root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
        root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
        root.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#2481cc');
        root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
        root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
        root.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f1f1f1');
    }
}

// Input formatting function
function formatInput(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-digit characters

    if (value.length > 8) {
        value = value.slice(0, 8); // Limit input length to 8 digits
    }

    if (value.length === 8) {
        value = value.slice(0, 3) + '/' + value.slice(3, 5) + 'R' + value.slice(5, 7) + '.' + value.slice(7);
    } else if (value.length === 7) {
        value = value.slice(0, 3) + '/' + value.slice(3, 5) + 'R' + value.slice(5);
    } else if (value.length === 6) {
        value = value.slice(0, 3) + '/' + value.slice(3, 5) + 'R' + value.slice(5);
    } else if (value.length > 3) {
        value = value.slice(0, 3) + '/' + value.slice(3);
    }

    input.value = value;
}

// Show loading overlay
function showLoading() {
    document.getElementById('loading').classList.add('show');
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loading').classList.remove('show');
}

// Clear form function
function clearForm() {
    document.getElementById('tire1').value = '';
    document.getElementById('tire2').value = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').classList.remove('show');
    
    // Haptic feedback
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Share results function
function shareResults() {
    const resultElement = document.getElementById('result');
    if (resultElement.innerHTML.trim()) {
        const text = resultElement.textContent || resultElement.innerText;
        
        if (tg && tg.MainButton) {
            // Use Telegram's share functionality
            tg.MainButton.setText('Поділитися результатами');
            tg.MainButton.show();
            tg.MainButton.onClick(() => {
                if (navigator.share) {
                    navigator.share({
                        title: 'Шинний калькулятор - Результати',
                        text: text,
                        url: window.location.href
                    });
                } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(text).then(() => {
                        showNotification('Результати скопійовано в буфер обміну');
                    });
                }
                tg.MainButton.hide();
            });
        } else if (navigator.share) {
            navigator.share({
                title: 'Шинний калькулятор - Результати',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Результати скопійовано в буфер обміну');
            });
        }
    }
    
    // Haptic feedback
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--success-color);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1001;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Tire weights database
const tireWeights = {
    "200/70R16": 14.10,
    "900/65R46": 518.70,
    "750/70R44": 405.43,
    "240/70R16": 18.80,
    "260/70R16": 22.80,
    "260/70R20": 30.70,
    "265/70R16": 26.50,
    "270/80R32": 45.00,
    "270/80R36": 49.80,
    "270/95R32": 57.50,
    "270/95R48": 76.60,
    "280/70R16": 26.54,
    "280/70R18": 28.90,
    "280/70R20": 31.40,
    "280/85R20": 42.00,
    "280/85R24": 45.20,
    "280/85R28": 49.90,
    "285/80R16": 34.20,
    "300/70R20": 36.00,
    "300/85R42": 68.80,
    "300/95R42": 75.10,
    "320/65R16": 35.80,
    "320/70R20": 42.30,
    "320/70R24": 44.50,
    "320/85R24": 55.20,
    "320/85R28": 60.40,
    "320/85R32": 67.20,
    "320/85R34": 72.00,
    "320/85R38": 73.80,
    "320/90R32": 73.90,
    "320/90R42": 94.50,
    "320/90R50": 109.90,
    "320/90R54": 122.16,
    "320/95R46": 96.30,
    "340/85R24": 61.40,
    "340/85R36": 82.00,
    "340/85R38": 83.70,
    "340/90R48": 108.00,
    "360/70R20": 50.70,
    "360/70R24": 61.00,
    "360/80R20": 64.70,
    "360/80R24": 73.60,
    "380/105R54": 176.87,
    "380/70R20": 55.00,
    "380/70R24": 62.30,
    "380/70R28": 73.60,
    "380/80R38": 102.40,
    "380/85R24": 76.40,
    "380/85R28": 80.80,
    "380/85R30": 88.30,
    "380/85R34": 96.40,
    "380/90R46": 125.00,
    "380/90R50": 148.20,
    "380/90R54": 145.38,
    "380/95R38": 98.97,
    "400/80R24": 93.20,
    "400/80R28": 102.50,
    "405/70R24": 74.20,
    "420/65R20": 64.40,
    "420/65R24": 63.50,
    "420/70R24": 84.40,
    "420/70R28": 85.50,
    "420/70R30": 92.30,
    "420/85R24": 83.30,
    "420/85R28": 98.90,
    "420/85R30": 98.80,
    "420/85R34": 107.90,
    "420/85R38": 116.80,
    "420/90R30": 109.23,
    "425/55R17": 56.80,
    "440/50R17": 55.20,
    "440/65R24": 75.00,
    "440/65R28": 85.20,
    "440/70R24": 87.40,
    "440/70R28": 96.00,
    "440/80R24": 110.10,
    "440/80R28": 120.90,
    "440/80R30": 124.20,
    "440/80R34": 137.30,
    "445/70R24": 90.40,
    "460/70R24": 85.50,
    "460/85R30": 120.10,
    "460/85R34": 131.20,
    "460/85R38": 140.10,
    "480/65R24": 82.00,
    "480/65R28": 93.00,
    "480/70R24": 91.90,
    "480/70R28": 100.50,
    "480/70R30": 105.70,
    "480/70R34": 115.10,
    "480/70R38": 124.40,
    "480/80R26": 123.50,
    "480/80R34": 152.30,
    "480/80R38": 167.80,
    "480/80R42": 156.90,
    "480/80R46": 182.40,
    "480/80R50": 183.70,
    "480/95R50": 203.59,
    "495/70R24": 106.20,
    "495/70R30": 124.80,
    "500/50R17": 49.50,
    "500/60R22.5": 113.00,
    "500/70R24": 106.90,
    "500/80R28": 138.10,
    "500/85R24": 130.80,
    "500/85R30": 156.40,
    "500/85R34": 168.00,
    "520/70R34": 147.30,
    "520/70R38": 145.60,
    "520/85R38": 188.70,
    "520/85R42": 208.80,
    "520/85R46": 211.70,
    "540/65R24": 99.70,
    "540/65R28": 112.50,
    "540/65R30": 121.80,
    "540/65R34": 126.70,
    "540/65R38": 137.10,
    "540/80R38": 211.60,
    "560/45R22.5": 98.70,
    "560/60R22.5": 98.70,
    "580/70R38": 198.70,
    "580/85R42": 240.28,
    "600/50R22.5": 121.10,
    "600/55R26": 152.60,
    "600/60R30": 169.30,
    "600/65R28": 136.20,
    "600/65R30": 143.70,
    "600/65R34": 153.30,
    "600/65R38": 169.20,
    "600/70R28": 177.00,
    "600/70R30": 177.40,
    "620/55R26": 151.30,
    "620/70R30": 204.50,
    "620/75R26": 197.89,
    "620/75R30": 207.80,
    "650/55R26": 169.70,
    "650/60R34": 215.60,
    "650/65R26": 198.30,
    "650/65R34": 230.10,
    "650/65R38": 191.50,
    "650/65R42": 227.30,
    "650/75R32": 212.10,
    "650/75R38": 265.00,
    "650/75R42": 267.00,
    "650/85R38": 329.60,
    "680/60R30": 238.40,
    "680/80R38": 320.80,
    "680/80R42": 382.40,
    "680/85R32": 273.20,
    "710/45R22.5": 141.10,
    "710/50R26": 191.70,
    "710/55R30": 192.90,
    "710/60R30": 216.80,
    "710/60R34": 234.00,
    "710/65R30": 235.40,
    "710/65R46": 316.57,
    "710/70R38": 293.90,
    "710/70R42": 352.40,
    "710/75R42": 362.50,
    "750/55R30": 223.20,
    "750/60R30": 260.50,
    "750/65R26": 238.70,
    "800/45R26": 201.30,
    "800/65R32": 301.20,
    "800/70R32": 332.80,
    "800/70R38": 374.70,
    "800/70R42": 454.10,
    "850/50R30": 287.60,
    "900/60R32": 330.40,
    "900/60R38": 401.80,
    "900/60R42": 426.80,
    "900/70R32": 449.20,
    "205/65R17.5": 14.7,
    "205/75R17.5": 15.7,
    "215/75R17.5": 27.5,
    "225/75R17.5": 21.7,
    "235/75R17.5": 29.3,
    "245/70R17.5": 30.5,
    "265/70R17.5": 31.9,
    "245/70R19.5": 34.3,
    "265/70R19.5": 39.1,
    "285/70R19.5": 43.3,
    "305/70R19.5": 45.3,
    "435/50R19.5": 63.3,
    "275/70R22.5": 50.6,
    "275/80R22.5": 51.6,
    "295/60R22.5": 53.0,
    "295/75R22.5": 62.5,
    "295/80R22.5": 63.2,
    "305/70R22.5": 61.3,
    "315/60R22.5": 63.5,
    "315/70R22.5": 64.5,
    "315/80R22.5": 71.0,
    "385/55R22.5": 74.4,
    "385/65R22.5": 75.4,
    "425/65R22.5": 84.9,
    "445/65R22.5": 95.1,
    "425/85R21": 120.7
};

// Parse tire input function
function parseTireInput(input) {
    const regex = /(\d+)\/(\d+)R(\d+\.?\d*)/;
    const match = input.match(regex);
    if (match) {
        return {
            width: parseFloat(match[1]),
            aspectRatio: parseFloat(match[2]),
            diameter: parseFloat(match[3].replace(',', '.')),
            size: match[0]
        };
    } else {
        return null;
    }
}

// Calculate tire parameters function
function calculateTireParameters(width, aspectRatio, diameter) {
    const tireSidewallHeight = (width * aspectRatio) / 100;
    const rimDiameterMm = diameter * 25.4;
    const tireHeightMm = 2 * tireSidewallHeight + rimDiameterMm;
    const tireCircumference = Math.PI * tireHeightMm;
    const tireVolume = (tireHeightMm * tireHeightMm * width) / 1000000000;
    return { tireHeightMm, tireCircumference, tireVolume };
}

// Format number with proper units
function formatNumber(value, unit) {
    return `${value.toFixed(2)} ${unit}`;
}

// Main calculation function
function calculateTires() {
    showLoading();
    
    setTimeout(() => {
        const tire1Input = document.getElementById('tire1').value;
        const tire2Input = document.getElementById('tire2').value;

        const tire1 = parseTireInput(tire1Input);
        const tire2 = parseTireInput(tire2Input);

        if (!tire1) {
            showError('Введіть правильні розміри шин у форматі 710/70R42');
            hideLoading();
            return;
        }

        const tire1Params = calculateTireParameters(tire1.width, tire1.aspectRatio, tire1.diameter);
        let resultHTML = '';

        // First tire results
        resultHTML += `
            <div class="result-section">
                <h3>🔴 Перший розмір: ${tire1.size}</h3>
                <div class="result-item">
                    <span class="result-label">Висота шини:</span>
                    <span class="result-value">${formatNumber(tire1Params.tireHeightMm, 'мм')}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Довжина окружності:</span>
                    <span class="result-value">${formatNumber(tire1Params.tireCircumference, 'мм')}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Об'єм шини:</span>
                    <span class="result-value">${formatNumber(tire1Params.tireVolume, 'м³')}</span>
                </div>
        `;

        if (tireWeights[tire1.size]) {
            resultHTML += `
                <div class="result-item">
                    <span class="result-label">Вага шини:</span>
                    <span class="result-value">${formatNumber(tireWeights[tire1.size], 'кг')}</span>
                </div>
            `;
        }

        resultHTML += '</div>';

        // Second tire results (if provided)
        if (tire2) {
            const tire2Params = calculateTireParameters(tire2.width, tire2.aspectRatio, tire2.diameter);
            const heightDifference = tire2Params.tireHeightMm - tire1Params.tireHeightMm;
            const circumferenceRatio = tire2Params.tireCircumference / tire1Params.tireCircumference;

            resultHTML += `
                <div class="result-section">
                    <h3>🔵 Другий розмір: ${tire2.size}</h3>
                    <div class="result-item">
                        <span class="result-label">Висота шини:</span>
                        <span class="result-value">${formatNumber(tire2Params.tireHeightMm, 'мм')}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Довжина окружності:</span>
                        <span class="result-value">${formatNumber(tire2Params.tireCircumference, 'мм')}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Об'єм шини:</span>
                        <span class="result-value">${formatNumber(tire2Params.tireVolume, 'м³')}</span>
                    </div>
            `;

            if (tireWeights[tire2.size]) {
                resultHTML += `
                    <div class="result-item">
                        <span class="result-label">Вага шини:</span>
                        <span class="result-value">${formatNumber(tireWeights[tire2.size], 'кг')}</span>
                    </div>
                `;
            }

            resultHTML += '</div>';

            // Comparison section
            resultHTML += `
                <div class="result-section comparison-section">
                    <h3>📊 Порівняння</h3>
                    <div class="result-item">
                        <span class="result-label">Різниця у висоті кліренсу:</span>
                        <span class="result-value">${formatNumber(heightDifference / 2, 'мм')}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Співвідношення окружностей:</span>
                        <span class="result-value">${circumferenceRatio.toFixed(3)}</span>
                    </div>
                </div>
            `;
        }

        const resultContainer = document.getElementById('result');
        resultContainer.innerHTML = resultHTML;
        resultContainer.classList.add('show');
        
        hideLoading();
        
        // Haptic feedback
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('success');
        }
        
        // Show success notification
        showNotification('Розрахунок завершено успішно!');
        
    }, 500); // Simulate calculation time
}

// Show error message
function showError(message) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `<div class="error-message">❌ ${message}</div>`;
    resultContainer.classList.add('show');
    
    // Haptic feedback
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('error');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Telegram Web App
    initTelegramApp();
    
    // Form submission
    document.getElementById('tire-form').addEventListener('submit', function(event) {
        event.preventDefault();
        calculateTires();
    });

    // Input formatting
    document.querySelectorAll('.tire-input').forEach(input => {
        input.addEventListener('input', function(event) {
            formatInput(event.target);
        });
    });
    
    // Haptic feedback on button press
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchstart', function() {
            if (tg && tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
        });
    });
});

// Export functions for global access
window.clearForm = clearForm;
window.shareResults = shareResults;
