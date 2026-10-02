
const kurullar = [
    { id: 'k1', akts: 4 },
    { id: 'k2', akts: 5 },
    { id: 'k3', akts: 6 },
    { id: 'k4', akts: 3 },
    { id: 'k5', akts: 5 },
    { id: 'k6', akts: 6 },
    { id: 'k7', akts: 5 },
    { id: 'k8', akts: 4 },
    { id: 'k9', akts: 4 }
];

function hesapla() {
    let agirlikliToplam = 0;
    let girilenAktsToplami = 0;

    for (let k of kurullar) {
        const inputElem = document.getElementById(k.id);
        const val = parseFloat(inputElem.value);

        if (!isNaN(val) && val >= 0 && val <= 100) {
            agirlikliToplam += val * k.akts;
            girilenAktsToplami += k.akts;
        }
    }

    if (girilenAktsToplami === 0) {
        alert("Lütfen en az bir kurul notu giriniz.");
        return;
    }

    const blokOrtalamasi = agirlikliToplam / girilenAktsToplami;

    const mduInput = document.getElementById('mdu');
    const pdoInput = document.getElementById('pdo');
    const mdu = (mduInput && mduInput.value !== '') ? parseFloat(mduInput.value) : 100;
    const pdo = (pdoInput && pdoInput.value !== '') ? parseFloat(pdoInput.value) : 100;

    const finalInput = document.getElementById('final-input');
    const girilenFinal = (finalInput && finalInput.value !== '') ? parseFloat(finalInput.value) : null;

    const resultBox = document.getElementById('result-area');
    const statusBanner = document.getElementById('status-banner');
    const blokOrtVal = document.getElementById('res-blok-ort');
    const gerekenFinalVal = document.getElementById('res-gereken-final');
    const yilSonuVal = document.getElementById('res-yil-sonu');
    const descExplainer = document.getElementById('res-explainer');

    if (resultBox) resultBox.classList.remove('hidden');
    if (blokOrtVal) blokOrtVal.innerText = blokOrtalamasi.toFixed(2);

    if (blokOrtalamasi >= 80.00) {
        // Formül: [(Blok * 0.75) + (MDÜ * 0.10) + (PDÖ * 0.10)] * (100 / 95)
        const hamToplam = (blokOrtalamasi * 0.75) + (mdu * 0.10) + (pdo * 0.10);
        const yilSonuOrtalamasi = hamToplam * (100 / 95);

        statusBanner.className = 'status-banner banner-success';
        statusBanner.innerHTML = `
            <div class="banner-icon"><i class="fa-solid fa-circle-check text-green"></i></div>
            <div>
                <h3 class="text-green">Tebrikler, Finalden Muafsınız!</h3>
                <p>Blok ortalamanız 80.00 üzerinde olduğu için finale girmeden sınıfı doğrudan geçtiniz.</p>
            </div>
        `;

        gerekenFinalVal.innerText = "Gereksiz (Muaf)";
        gerekenFinalVal.className = "metric-value text-green";

        yilSonuVal.innerText = yilSonuOrtalamasi.toFixed(2);
        yilSonuVal.className = "metric-value text-green";

        descExplainer.innerHTML = `
            <strong>Finalsiz Geçme (Muafiyet) Hesabı:</strong><br>
            • Blok Ortalaması (%75): <strong>${(blokOrtalamasi * 0.75).toFixed(2)}</strong><br>
            • MDÜ Katkısı (%10 - Not: ${mdu}): <strong>${(mdu * 0.10).toFixed(2)}</strong><br>
            • PDÖ Katkısı (%10 - Not: ${pdo}): <strong>${(pdo * 0.10).toFixed(2)}</strong><br>
            • Normalizasyon Çarpanı: <strong>100 / 95</strong><br>
            👉 <strong>Yıl Sonu Başarı Notunuz:</strong> [${(blokOrtalamasi * 0.75).toFixed(2)} + ${(mdu * 0.10).toFixed(2)} + ${(pdo * 0.10).toFixed(2)}] × 1.0526 = <strong>${yilSonuOrtalamasi.toFixed(2)}</strong>
        `;
        return;
    }

    const tabanBilesenler = (blokOrtalamasi * 0.50) + (mdu * 0.10) + (pdo * 0.10);

    // SENARYO A: Kullanıcı Final Notunu Girdiyse
    if (girilenFinal !== null) {
        const hamYilSonu = tabanBilesenler + (girilenFinal * 0.25);
        const gercekYilSonu = hamYilSonu * (100 / 95);

        const barajGecti = girilenFinal >= 49.50;
        const ortalamaGecti = gercekYilSonu >= 69.50;

        if (barajGecti && ortalamaGecti) {
            statusBanner.className = 'status-banner banner-success';
            statusBanner.innerHTML = `
                <div class="banner-icon"><i class="fa-solid fa-circle-check text-green"></i></div>
                <div>
                    <h3 class="text-green">Tebrikler, Sınıfı Geçtiniz!</h3>
                    <p>Girilen final notuyla hem final barajını hem de 69.50 yıl sonu barajını geçtiniz.</p>
                </div>
            `;
            gerekenFinalVal.innerText = girilenFinal.toFixed(1) + " (Girildi)";
            gerekenFinalVal.className = "metric-value text-green";
            yilSonuVal.innerText = gercekYilSonu.toFixed(2);
            yilSonuVal.className = "metric-value text-green";
        } else {
            statusBanner.className = 'status-banner banner-danger';
            let hataSebebi = !barajGecti ? "Final sınav notunuz 49.50 barajının altında kaldı." : "Yıl sonu ortalamanız 69.50 barajının altında kaldı.";
            statusBanner.innerHTML = `
                <div class="banner-icon"><i class="fa-solid fa-triangle-exclamation text-red"></i></div>
                <div>
                    <h3 class="text-red">Bütünlemeye Kaldınız</h3>
                    <p>${hataSebebi}</p>
                </div>
            `;
            gerekenFinalVal.innerText = girilenFinal.toFixed(1) + " (Yetersiz)";
            gerekenFinalVal.className = "metric-value text-red";
            yilSonuVal.innerText = gercekYilSonu.toFixed(2);
            yilSonuVal.className = "metric-value text-red";
        }

        descExplainer.innerHTML = `
            <strong>Hesaplanan Yıl Sonu Notu Dökümü:</strong><br>
            • Blok Katkısı (%50): <strong>${(blokOrtalamasi * 0.50).toFixed(2)}</strong><br>
            • Final Katkısı (%25 - Not: ${girilenFinal}): <strong>${(girilenFinal * 0.25).toFixed(2)}</strong><br>
            • MDÜ Katkısı (%10 - Not: ${mdu}): <strong>${(mdu * 0.10).toFixed(2)}</strong><br>
            • PDÖ Katkısı (%10 - Not: ${pdo}): <strong>${(pdo * 0.10).toFixed(2)}</strong><br>
            👉 <strong>Yıl Sonu Notunuz:</strong> [${hamYilSonu.toFixed(2)}] × (100/95) = <strong>${gercekYilSonu.toFixed(2)}</strong>
        `;
        return;
    }

    // SENARYO B: Final Notu Boş Bırakıldıysa (Kaç Alması Gerektiğini Göster)
    const gerekenHamToplam = 69.50 * 0.95;
    const gerekenFinalHam = (gerekenHamToplam - tabanBilesenler) / 0.25;
    let gerekenFinal = Math.max(49.50, gerekenFinalHam);

    if (gerekenFinal > 100) {
        statusBanner.className = 'status-banner banner-danger';
        statusBanner.innerHTML = `
            <div class="banner-icon"><i class="fa-solid fa-triangle-exclamation text-red"></i></div>
            <div>
                <h3 class="text-red">Bütünleme İhtimali Yüksek</h3>
                <p>Mevcut blok ortalaması ile finalde 100 alınsa dahi 69.50 barajına ulaşılamıyor.</p>
            </div>
        `;
        gerekenFinalVal.innerText = "İmkansız (>100)";
        gerekenFinalVal.className = "metric-value text-red";
        yilSonuVal.innerText = "--";
        yilSonuVal.className = "metric-value text-red";
    } else {
        statusBanner.className = 'status-banner banner-info';
        statusBanner.innerHTML = `
            <div class="banner-icon"><i class="fa-solid fa-circle-info text-blue"></i></div>
            <div>
                <h3 class="text-blue">Final Sınavına Girmeniz Gerekiyor</h3>
                <p>Blok ortalamanız 80.00 altında olduğu için muafiyet kazanamadınız.</p>
            </div>
        `;
        gerekenFinalVal.innerText = gerekenFinal.toFixed(1);
        gerekenFinalVal.className = "metric-value text-blue";

        const tahminiHam = tabanBilesenler + (gerekenFinal * 0.25);
        const tahminiYilSonu = tahminiHam * (100 / 95);
        yilSonuVal.innerText = tahminiYilSonu.toFixed(2);
        yilSonuVal.className = "metric-value text-blue";
    }

    descExplainer.innerHTML = `
        <strong>Final ile Geçme Hesabı:</strong><br>
        Formül: [(Blok × 0.50) + (Final × 0.25) + (MDÜ × 0.10) + (PDÖ × 0.10)] × (100/95) ≥ 69.50<br>
        • Final barajı en az <strong>49.50</strong> puandır.<br>
        • Final notunuz belliyse yukarıdaki kutucuğa yazarak doğrudan kesin yıl sonu ortalamanızı görebilirsiniz.
    `;
}

function sifirla() {
    kurullar.forEach(k => {
        const inp = document.getElementById(k.id);
        if (inp) inp.value = '';
    });
    const finalInp = document.getElementById('final-input');
    if (finalInp) finalInp.value = '';
    const resultBox = document.getElementById('result-area');
    if (resultBox) resultBox.classList.add('hidden');
}
