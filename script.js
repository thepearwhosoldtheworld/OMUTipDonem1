document.addEventListener('DOMContentLoaded', () => {
    const kurullar = [
        { id: 'k1', akts: 1, fixed: 100 },
        { id: 'k2', akts: 4 },
        { id: 'k3', akts: 5 },
        { id: 'k4', akts: 3 },
        { id: 'k5', akts: 5 },
        { id: 'k6', akts: 5 },
        { id: 'k7', akts: 5 },
        { id: 'k8', akts: 5 },
        { id: 'k9', akts: 9 }
    ];

    const calcBtn = document.getElementById('calc-btn');
    const clearBtn = document.getElementById('btn-clear-kurul');
    const resultDashboard = document.getElementById('result-dashboard');

    // Kurul Sıfırlama Butonu
    clearBtn.addEventListener('click', () => {
        kurullar.forEach(k => {
            if (!k.fixed) {
                const el = document.getElementById(k.id);
                if (el) el.value = '';
            }
        });
        document.getElementById('mdu').value = '';
        document.getElementById('pdo').value = '';
        resultDashboard.classList.add('hidden');
    });

    // Hesaplama Fonksiyonu
    calcBtn.addEventListener('click', () => {
        let toplamPuan = 0;
        let toplamAkts = 0;
        let girilenKurulSayisi = 0;

        kurullar.forEach(kurul => {
            if (kurul.fixed !== undefined) {
                toplamPuan += kurul.fixed * kurul.akts;
                toplamAkts += kurul.akts;
                girilenKurulSayisi++;
            } else {
                const input = document.getElementById(kurul.id);
                const val = parseFloat(input.value);
                if (!isNaN(val) && val >= 0 && val <= 100) {
                    toplamPuan += val * kurul.akts;
                    toplamAkts += kurul.akts;
                    girilenKurulSayisi++;
                }
            }
        });

        if (girilenKurulSayisi <= 1) {
            alert('Lütfen en az bir kurul sınav notunuzu giriniz.');
            return;
        }

        const kurulOrtalamasi = toplamPuan / toplamAkts;

        // MDU ve PDÖ Notları (Girilmemişse 0 sayılmaz, girilene göre hesaplanır)
        const mduVal = parseFloat(document.getElementById('mdu').value);
        const pdoVal = parseFloat(document.getElementById('pdo').value);

        const mdu = !isNaN(mduVal) ? mduVal : 0;
        const pdo = !isNaN(pdoVal) ? pdoVal : 0;

        // Arayüz Elementleri
        const valKurulOrt = document.getElementById('val-kurul-ort');
        const valMuafiyet = document.getElementById('val-muafiyet');
        const muafiyetDiff = document.getElementById('muafiyet-diff');
        const valFinalNeeded = document.getElementById('val-final-needed');
        const statusBanner = document.getElementById('status-banner');
        const statusTitle = document.getElementById('status-title');
        const statusDesc = document.getElementById('status-desc');
        const statusIcon = document.getElementById('status-icon-i');
        const explainer = document.getElementById('calc-explainer');

        resultDashboard.classList.remove('hidden');
        valKurulOrt.textContent = kurulOrtalamasi.toFixed(2);

        // 1. Finalsiz Geçme (Muafiyet) Analizi
        const muafiyetBaraji = 80.0;
        if (kurulOrtalamasi >= muafiyetBaraji) {
            valMuafiyet.textContent = "HAK KAZANDINIZ";
            valMuafiyet.className = "metric-value text-green";
            muafiyetDiff.textContent = `+${(kurulOrtalamasi - muafiyetBaraji).toFixed(1)} Puan Üstünde`;
            muafiyetDiff.className = "pill-state pill-green";

            valFinalNeeded.textContent = "0 (Muaf)";
            valFinalNeeded.className = "metric-value text-green";

            statusBanner.className = "status-banner banner-success";
            statusIcon.className = "fa-solid fa-circle-check";
            statusTitle.textContent = "Finalden Muafsınız!";
            statusDesc.textContent = `Kurul ortalamanız ${kurulOrtalamasi.toFixed(2)} ile 80 barajını aştığı için finale girmeden doğrudan geçiyorsunuz.`;
            
            explainer.innerHTML = `<i class="fa-solid fa-info-circle"></i> Tebrikler! Yönerge gereğince kurul ortalaması 80.0 ve üzeri olan öğrenciler final sınavına girmek zorunda değildir.`;
            return;
        } else {
            valMuafiyet.textContent = "Muaf Değil";
            valMuafiyet.className = "metric-value text-amber";
            const fark = (muafiyetBaraji - kurulOrtalamasi).toFixed(1);
            muafiyetDiff.textContent = `Muafiyete ${fark} puan var`;
            muafiyetDiff.className = "pill-state pill-amber";
        }

        // 2. Gereken Final Puanı Formülü
        // 69.5 = ((Kurul * 0.50) + (Final * 0.25) + (MDU * 0.10) + (PDÖ * 0.10)) * (100 / 95)
        const hedefToplam = 69.5 * (95 / 100); // 66.025
        const mevcutKatkı = (kurulOrtalamasi * 0.50) + (mdu * 0.10) + (pdo * 0.10);
        let gerekenFinal = (hedefToplam - mevcutKatkı) / 0.25;

        const finalBaraji = 49.5;
        let barajUyarisi = false;

        if (gerekenFinal < finalBaraji) {
            gerekenFinal = finalBaraji;
            barajUyarisi = true;
        }

        if (gerekenFinal > 100) {
            valFinalNeeded.textContent = "İmkânsız (>100)";
            valFinalNeeded.className = "metric-value text-red";

            statusBanner.className = "status-banner banner-danger";
            statusIcon.className = "fa-solid fa-triangle-exclamation";
            statusTitle.textContent = "Final ile Geçilemiyor (Büte Kaldınız)";
            statusDesc.textContent = "Mevcut notlar ile finalden 100 alsanız bile 69.5 geçme sınırına ulaşılamıyor.";

            explainer.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Sene sonu ortalamanızın 69.5 olabilmesi için finalden 100'ün üzerinde not almanız gerekirdi. Bu şartlarda bütünleme sınavı veya kurul notlarını telafi etmeniz gerekecektir.`;
        } else {
            valFinalNeeded.textContent = gerekenFinal.toFixed(1);
            valFinalNeeded.className = "metric-value text-accent";

            statusBanner.className = "status-banner banner-info";
            statusIcon.className = "fa-solid fa-graduation-cap";
            statusTitle.textContent = `Final Hedefi: ${gerekenFinal.toFixed(1)}`;
            statusDesc.textContent = barajUyarisi 
                ? "Yıl sonu ortalamanız kurtarsa dahi final taban barajı (49.5) geçerlidir."
                : `69.5 geçme notunu yakalamak için finalden en az ${gerekenFinal.toFixed(1)} almalısınız.`;

            explainer.innerHTML = `
                <div class="explainer-item">
                    <span>Mevcut Kurul Katkısı (%50): <strong>+${(kurulOrtalamasi * 0.50).toFixed(2)}</strong></span>
                    <span>MDU (%10) + PDÖ (%10) Katkısı: <strong>+${((mdu * 0.10) + (pdo * 0.10)).toFixed(2)}</strong></span>
                    <span>100/95 Katsayı Düzeltmesi: <strong>Dahil edildi</strong></span>
                </div>
            `;
        }

        // Sonuç paneline yumuşak kaydır
        resultDashboard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});
