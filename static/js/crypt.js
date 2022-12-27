$('#submit').click(() => {
    const content = JSON.parse($('#markdown').html());

    const password = Uint8Array.from($('#pwd').val(), c => c.charCodeAt(0));
    const salt = Uint8Array.from(atob(content['salt']), c => c.charCodeAt(0));
    const ct = Uint8Array.from(atob(content['cipher_text']), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(content['iv']), c => c.charCodeAt(0));

    const n = 2**14;
    const r = 8;
    const p = 1;
    const dklen = 32;

    const keyPromise = scrypt.scrypt(password, salt, n, r, p, dklen);

    keyPromise.then(function(private_key) {
        const cipher = new aesjs.ModeOfOperation.cbc(private_key, iv);

        var plaintext = cipher.decrypt(ct);
        plaintext = new TextDecoder().decode(plaintext);
        const pad = plaintext.charCodeAt(plaintext.length - 1);
        plaintext = plaintext.substring(0, plaintext.length - pad);

        if (!plaintext.startsWith("<")) {
            $("#pwd").val("");
            return;
        }

        $('#pwd-form').remove();
        $('#markdown').html(plaintext);
        $('#markdown').removeClass("hidden");

        // I pulled hairs on this one
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById("markdown")]);
    });
})
