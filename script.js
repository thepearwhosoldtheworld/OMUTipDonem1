const kurullar = [
    { id: 'k1', akts: 4 }, // Hayatın Temeli
    { id: 'k2', akts: 5 }, // Enerji
    { id: 'k3', akts: 6 }, // Hareket
    { id: 'k4', akts: 3 }, // Seçmeli Kurul (3 AKTS)
    { id: 'k5', akts: 5 }, // Doku / Yaşam
    { id: 'k6', akts: 6 }, // Destek ve Hareket
    { id: 'k7', akts: 5 }, // Dolaşım / Mikroçevrede Denge
    { id: 'k8', akts: 4 }, // Beslenme
    { id: 'k9', akts: 4 }  // Üreme
];

function hesapla() {
    let agirlikliToplam = 0;
    let girilenAktsToplami = 0;

    for (let i = 0; i < kurullar.length; i++) {
        const k = kurullar[i];
        let inputElem = document.getElementById(k.id);
        
        if (!inputElem) {
            const allInputs = document.querySelectorAll('.card-input input, .kurul-row input, .grid-two input');
            if (allInputs[i]) inputElem = allInputs[i];
        }

        if (inputElem && inputElem.value.trim() !== '') {
            const val = parseFloat(inputElem.value.replace(',', '.'));
            if (!isNaN(val) && val >= 0 && val <= 100) {
                agirlikliToplam += val * k.akts;
                girilenAktsToplami += k.akts;
            }
        }
    }

    if (girilenAktsToplami === 0) {
        alert("Lütfen en az bir kurul notu giriniz.");
        return;
    }

    // Blok Ortalaması
    const blokOrtalamasi = agirlikliToplam / girilenAktsToplami;

    const mduInput = document.getElementById('mdu');
    const pdoInput = document.getElementById('pdo');
    const mdu = (mduInput && mduInput.value.trim() !== '') ? parseFloat(mduInput.value.replace(',', '.')) : 100;
    const pdo = (pdoInput && pdoInput.value.trim() !== '') ? parseFloat(pdoInput.value.replace(',', '.')) : 100;

    // Final Kutusu
    const finalInput = document.getElementById('final-input');
    const girilenFinal = (finalInput && finalInput.value.trim() !== '') ? parseFloat(finalInput.value.replace(',', '.')) : null;

    // Sonuç Ekranı Alanları
    let resultBox = document.getElementById('result-area');
    let statusBanner = document.getElementById('status-banner');
    let blokOrtVal = document.getElementById('res-blok-ort');
    let gerekenFinalVal = document.getElementById('res-gereken-final');
    let yilSonuVal = document.getElementById('res-yil-sonu');
    let descExplainer = document.getElementById('res-explainer');

    if (!resultBox) {
        const container = document.querySelector('.calculator-container') || document.body;
        resultBox = document.createElement('div');
        resultBox.id = 'result-area';
        resultBox.className = 'result-card glass-panel';
        resultBox.innerHTML = `
            <div id="status-banner" class="status-banner"></div>
            <div class="metrics-grid" style="display: flex; gap: 16px; margin: 16px 0;">
                <div class="metric-box"><span>Blok Ortalaması</span><h2 id="res-blok-ort">--</h2></div>
                <div class="metric-box"><span>Gereken Final</span><h2 id="res-gereken-final">--</h2></div>
                <div class="metric-box"><span>Yıl Sonu Notu</span><h2 id="res-yil-sonu">--</h2></div>
            </div>
            <div id="res-explainer" class="explainer-box"></div>
        `;
        const btn = document.querySelector('button[onclick="hesapla()"]') || document.querySelector('.btn-primary');
        if (btn && btn.parentNode) {
            btn.parentNode.insertBefore(resultBox, btn.nextSibling);
        } else {
            container.appendChild(resultBox);
        }
        statusBanner = document.getElementById('status-banner');
        blokOrtVal = document.getElementById('res-blok-ort');
        gerekenFinalVal = document.getElementById('res-gereken-final');
        yilSonuVal = document.getElementById('res-yil-sonu');
        descExplainer = document.getElementById('res-explainer');
    }

    resultBox.classList.remove('hidden');
    resultBox.style.display = 'block';

    if (blokOrtVal) blokOrtVal.innerText = blokOrtalamasi.toFixed(2);

    if (blokOrtalamasi >= 80.00) {
        const hamToplam = (blokOrtalamasi * 0.75) + (mdu * 0.10) + (pdo * 0.10);
        const yilSonuOrtalamasi = hamToplam * (100 / 95);

        if (statusBanner) {
            statusBanner.className = 'status-banner banner-success';
            statusBanner.innerHTML = `
                <h3 style="color: #30d158; margin-bottom: 4px;">🎉 Tebrikler, Finalden Muafsınız!</h3>
                <p>Blok ortalamanız 80.00 üzerinde olduğu için finale girmeden doğrudan geçtiniz.</p>
            `;
        }

        if (gerekenFinalVal) {
            gerekenFinalVal.innerText = "Muaf (0)";
            gerekenFinalVal.style.color = "#30d158";
        }
        if (yilSonuVal) {
            yilSonuVal.innerText = yilSonuOrtalamasi.toFixed(2);
            yilSonuVal.style.color = "#30d158";
        }

        if (descExplainer) {
            descExplainer.innerHTML = `
                <strong>Finalsiz Geçme (Muafiyet) Hesabı:</strong><br>
                • Blok Ortalaması Katkısı (%75): <strong>${(blokOrtalamasi * 0.75).toFixed(2)}</strong><br>
                • MDÜ Katkısı (%10 - Not: ${mdu}): <strong>${(mdu * 0.10).toFixed(2)}</strong><br>
                • PDÖ Katkısı (%10 - Not: ${pdo}): <strong>${(pdo * 0.10).toFixed(2)}</strong><br>
                • Normalizasyon Çarpanı: <strong>100 / 95</strong><br>
                👉 <strong>Yıl Sonu Notunuz:</strong> [${hamToplam.toFixed(2)}] × (100/95) = <strong>${yilSonuOrtalamasi.toFixed(2)}</strong>
            `;
        }
        resultBox.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const tabanBilesenler = (blokOrtalamasi * 0.50) + (mdu * 0.10) + (pdo * 0.10);

    // Final notu girilmişse
    if (girilenFinal !== null) {
        const hamYilSonu = tabanBilesenler + (girilenFinal * 0.25);
        const gercekYilSonu = hamYilSonu * (100 / 95);
        const barajGecti = girilenFinal >= 49.50;
        const ortalamaGecti = gercekYilSonu >= 69.50;

        if (barajGecti && ortalamaGecti) {
            if (statusBanner) {
                statusBanner.className = 'status-banner banner-success';
                statusBanner.innerHTML = `
                    <h3 style="color: #30d158; margin-bottom: 4px;">✅ Tebrikler, Sınıfı Geçtiniz!</h3>
                    <p>Girilen final notuyla 69.50 barajını aştınız.</p>
                `;
            }
            if (gerekenFinalVal) {
                gerekenFinalVal.innerText = girilenFinal.toFixed(1);
                gerekenFinalVal.style.color = "#30d158";
            }
            if (yilSonuVal) {
                yilSonuVal.innerText = gercekYilSonu.toFixed(2);
                yilSonuVal.style.color = "#30d158";
            }
        } else {
            if (statusBanner) {
                statusBanner.className = 'status-banner banner-danger';
                const sebep = !barajGecti ? "Final notunuz 49.50 barajının altında." : "Yıl sonu ortalamanız 69.50 barajının altında.";
                statusBanner.innerHTML = `
                    <h3 style="color: #ff453a; margin-bottom: 4px;">⚠️ Bütünlemeye Kaldınız</h3>
                    <p>${sebep}</p>
                `;
            }
            if (gerekenFinalVal) {
                gerekenFinalVal.innerText = girilenFinal.toFixed(1);
                gerekenFinalVal.style.color = "#ff453a";
            }
            if (yilSonuVal) {
                yilSonuVal.innerText = gercekYilSonu.toFixed(2);
                yilSonuVal.style.color = "#ff453a";
            }
        }

        if (descExplainer) {
            descExplainer.innerHTML = `
                <strong>Yıl Sonu Notu Dökümü:</strong><br>
                • Blok Katkısı (%50): ${(blokOrtalamasi * 0.50).toFixed(2)}<br>
                • Final Katkısı (%25 - Not: ${girilenFinal}): ${(girilenFinal * 0.25).toFixed(2)}<br>
                • MDÜ Katkısı (%10): ${(mdu * 0.10).toFixed(2)} | PDÖ Katkısı (%10): ${(pdo * 0.10).toFixed(2)}<br>
                👉 <strong>Yıl Sonu Notunuz:</strong> [${hamYilSonu.toFixed(2)}] × (100/95) = <strong>${gercekYilSonu.toFixed(2)}</strong>
            `;
        }
        resultBox.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Final boş bırakılmışsa (Kaç alması gerektiğini hesapla)
    const gerekenHamToplam = 69.50 * 0.95; // 66.025
    const gerekenFinalHam = (gerekenHamToplam - tabanBilesenler) / 0.25;
    let gerekenFinal = Math.max(49.50, gerekenFinalHam);

    if (gerekenFinal > 100) {
        if (statusBanner) {
            statusBanner.className = 'status-banner banner-danger';
            statusBanner.innerHTML = `
                <h3 style="color: #ff453a; margin-bottom: 4px;">⚠️ Bütünleme İhtimali Yüksek</h3>
                <p>Mevcut blok ortalaması ile finalde 100 alsanız dahi 69.50'ye ulaşılamıyor.</p>
            `;
        }
        if (gerekenFinalVal) {
            gerekenFinalVal.innerText = "İmkansız (>100)";
            gerekenFinalVal.style.color = "#ff453a";
        }
        if (yilSonuVal) yilSonuVal.innerText = "--";
    } else {
        if (statusBanner) {
            statusBanner.className = 'status-banner banner-info';
            statusBanner.innerHTML = `
                <h3 style="color: #2997ff; margin-bottom: 4px;">ℹ️ Finale Girmeniz Gerekiyor</h3>
                <p>Blok ortalamanız 80.00 altında olduğu için finale girmeniz gerekiyor.</p>
            `;
        }
        if (gerekenFinalVal) {
            gerekenFinalVal.innerText = gerekenFinal.toFixed(1);
            gerekenFinalVal.style.color = "#2997ff";
        }
        const tahminiHam = tabanBilesenler + (gerekenFinal * 0.25);
        const tahminiYilSonu = tahminiHam * (100 / 95);
        if (yilSonuVal) {
            yilSonuVal.innerText = tahminiYilSonu.toFixed(2);
            yilSonuVal.style.color = "#2997ff";
        }
    }

    if (descExplainer) {
        descExplainer.innerHTML = `
            <strong>Final ile Geçme Hesabı:</strong><br>
            • Formül: [(Blok × 0.50) + (Final × 0.25) + (MDÜ × 0.10) + (PDÖ × 0.10)] × (100/95) ≥ 69.50<br>
            • Final barajı en az <strong>49.50</strong> puandır.<br>
            • Final notunuz belliyse Final kutusuna yazarak doğrudan yıl sonu notunuzu görebilirsiniz.
        `;
    }
    resultBox.scrollIntoView({ behavior: 'smooth' });
}

function sifirla() {
    document.querySelectorAll('input').forEach(inp => inp.value = '');
    const resultBox = document.getElementById('result-area');
    if (resultBox) resultBox.style.display = 'none';
}
