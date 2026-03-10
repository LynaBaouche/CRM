export async function sendBrevoEmail(
    toEmail: string, 
    toName: string, 
    subject: string, 
    content: string,
    title: string = "Veloria" // Titre par défaut
  ) {
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error("❌ ERREUR : La clé BREVO_API_KEY est introuvable !");
      return;
    }
  
    const htmlTemplate = `
      <div style="background-color: #F9FAFB; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #9333EA; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">${title}</h1>
          </div>
          <div style="color: #374151; font-size: 16px; line-height: 1.6;">
            ${content}
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #F3F4F6; text-align: center; color: #9CA3AF; font-size: 13px;">
            <p>Cet email a été envoyé de manière automatique par Veloria CRM.</p>
          </div>
        </div>
      </div>
    `;
  
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Veloria CRM', email: 'baouchelyna@gmail.com' }, // Ton email expéditeur centralisé ici
          to: [{ email: toEmail, name: toName }],
          subject: subject,
          htmlContent: htmlTemplate
        })
      });
  
      if (!response.ok) {
        const err = await response.text();
        console.error(`❌ Erreur Brevo: ${err}`);
      } else {
        console.log(`✅ Email envoyé avec succès à ${toEmail} !`);
      }
    } catch (error) {
      console.error("Erreur réseau Brevo:", error);
    }
  }