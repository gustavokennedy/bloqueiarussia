const RussianBlocker = (function (){
   //isso deve funcionar na maior parte do tempo, mas ignorará as cidades mais próximas da fronteira ucraniana, pois há alguma sobreposição no fuso horário/idiomas perto da fronteira
   //esta é a maneira mais fácil de fazer isso sem limitações ou sem pagar por uma API
    const isRussian = () => new Date().getTimezoneOffset() < -120 && navigator.language == "ru";
    
    const isBelarussian = () => navigator.language == "be";
    
    const shouldBeBlocked = (alsoBlockBelarussian) => {
        return isRussian() ||  (alsoBlockBelarussian && isBelarussian()) ? true : false;
    };
    
    const shouldBeNotifiedToday = (oncePerDay) => {
        if (!oncePerDay) return true;
        var x = getCookie("RussianOrBelarussian");
        if (x == "" || x == null) {
            setCookie("RussianOrBelarussian", true, 1);
            return true;
        }
    }
    
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    const alertWithCustomMessage = (config) => alert(config.customMessage ? config.customMessage : "🇺🇦протестуйте против войны!🇺🇦");

    const redirectToUkrainianAnthem = (config = {}) => {
        if (shouldBeNotifiedToday(config.oncePerDay) && shouldBeBlocked(config.alsoBlockBelarussian)) window.location = "https://www.youtube.com/watch?v=xDeQVaoTvJM";
    }

//redireciona os russos para o formulário de contato do governo.ru para incentivá-los a protestar
    const redirectToRussianGovernmentComplaints = (config = {}) => {
        if (shouldBeNotifiedToday(config.oncePerDay) && shouldBeBlocked(config.alsoBlockBelarussian)) {
            alertWithCustomMessage(config)
            window.location = "http://services.government.ru/letters/";
        }
    }

    const alertRussians = (config = {}) => {
        if (shouldBeNotifiedToday(config.oncePerDay) && shouldBeBlocked(config.alsoBlockBelarussian)) {
            alertWithCustomMessage(config)
        }
    }
    return {
        redirectToUkrainianAnthem,
        redirectToRussianGovernmentComplaints,
        alert: alertRussians,
        shouldBeBlocked
    };
})();
