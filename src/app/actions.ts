
// @ts-nocheck
"use server";

// Stripe is the current payment provider.

import { generateResumeContent, type GenerateResumeContentInput, type GenerateResumeContentOutput } from '@/ai/flows/generate-resume-content';
import { z } from 'zod';
import Stripe from 'stripe';

const GenerateResumeActionInputSchema = z.object({
  jobDescription: z.string(),
  selfDescription: z.string(),
});

export async function handleGenerateResume(
  input: z.infer<typeof GenerateResumeActionInputSchema>
): Promise<{ data?: GenerateResumeContentOutput; error?: string }> {
  try {
    // For generateResumeContent, hasExperience is a required boolean.
    // Simplification: assume no experience for now, so AI fabricates it.
    const aiInput: GenerateResumeContentInput = {
      ...input,
      hasExperience: false, 
    };
    const result = await generateResumeContent(aiInput);
    if (!result || !result.name || !result.contact?.email || !result.aboutMe) { 
        throw new Error('AI failed to generate essential resume content (name, contact, or about me).');
    }
    return { data: result };
  } catch (error) {
    console.error("Error generating resume:", error);
    return { error: error instanceof Error ? error.message : "An unknown error occurred while generating the resume." };
  }
}

export async function prepareHtmlForDownload(
  resumeData: GenerateResumeContentOutput
): Promise<{ htmlContent?: string; error?: string }> {
  try {
    const { name, contact, aboutMe, skills, languages, workExperience } = resumeData;

    const contactElements = [];
    if (contact?.email) contactElements.push(contact.email);
    if (contact?.phone) contactElements.push(contact.phone);
    if (contact?.linkedin) contactElements.push(contact.linkedin);
    const contactString = contactElements.map((item, index) => 
        `${item}${index < contactElements.length - 1 ? ' <span class="contact-separator">|</span> ' : ''}`
    ).join('');

    const skillsMidPoint = Math.ceil(skills.length / 2);
    const skillsCol1 = skills.slice(0, skillsMidPoint).map(skill => `<li class="list-item"><span class="custom-bullet"></span>${skill}</li>`).join('');
    const skillsCol2 = skills.slice(skillsMidPoint).map(skill => `<li class="list-item"><span class="custom-bullet"></span>${skill}</li>`).join('');
    
    const languagesHtml = languages.map(lang => `<li class="list-item"><span class="custom-bullet"></span>${lang.name} - ${lang.proficiency}</li>`).join('');
    
    const workExperienceHtml = workExperience.map(exp => `
      <div class="experience-entry">
        <div class="job-title">${exp.jobTitle}</div>
        <div class="company-dates">${exp.company} | ${exp.dates}</div>
        ${exp.duties && exp.duties.length > 0 ? `
          <ul class="duties-list">
            ${exp.duties.map(duty => `<li class="list-item"><span class="custom-bullet"></span>${duty}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('');

    const styles = `
      body { 
        margin: 0; 
        font-family: 'Open Sans', sans-serif; 
        background-color: #F0F0F0; /* Page background for contrast */
        color: #1F2937; /* Dark Charcoal */
        display: flex;
        justify-content: center;
        padding-top: 20px; /* For screen display */
        padding-bottom: 20px; /* For screen display */
      }
      .resume-container {
        width: 794px; /* A4 width at 96 DPI */
        min-height: 1123px; /* A4 height at 96 DPI */
        margin: 0 auto; /* Centering on screen for the body's flex container */
        background: #F9FAFB; /* Off-White */
        color: #1F2937; /* Dark Charcoal */
        font-family: 'Open Sans', sans-serif;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0,0,0,0.1); /* For screen display */
        padding: 75px; /* A4 margins */
      }
      .content-wrapper {
        position: relative; 
        z-index: 1;
      }
      .header {
        text-align: center;
        padding-bottom: 12px;
        margin-bottom: 0px; /* Header itself doesn't need bottom margin if first section has top margin */
        height: 120px; /* Fixed height for header area */
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .candidate-name {
        font-family: 'Montserrat', sans-serif;
        font-size: 22px;
        font-weight: 700;
        color: #1F2937;
        margin: 0 0 8px 0;
        line-height: 1.2;
      }
      .contact-details {
        font-size: 10px;
        color: #1F2937;
        font-family: 'Open Sans', sans-serif;
        line-height: 1.5;
        max-width: 600px;
        margin: 0 auto;
      }
      .contact-separator {
        color: #0D9488; /* Deep Teal */
        margin: 0 8px;
      }
      .header-divider {
        width: 80%;
        height: 1px;
        background: #E5E7EB; /* Light Gray */
        margin: 20px auto 0 auto;
      }
      .section {
        margin-top: 24px; 
        margin-bottom: 0px; /* Set to 0px, spacing handled by marginTop of next section */
      }
      .section-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: #1F2937;
        margin: 0 0 8px 0;
        position: relative;
        padding-bottom: 6px;
        line-height: 1.2;
      }
      .section-title-underline {
        content: "";
        position: absolute;
        bottom: 0px;
        left: 0;
        width: 20px;
        height: 2px;
        background: #0D9488; /* Deep Teal */
      }
      .section-divider {
        width: 90%;
        height: 1px;
        background: #E5E7EB;
        margin: 16px auto 0 auto; /* Spacing after section content, before section end */
      }
      .about-me-section { overflow: hidden; }
      .about-me-text {
        font-size: 11px;
        font-family: 'Open Sans', sans-serif;
        color: #1F2937;
        line-height: 1.5;
        text-align: justify;
        margin-bottom: 8px;
      }
      .skills-section { overflow: hidden; }
      .skills-list-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .skills-column {
        width: calc(50% - 10px);
        padding-left: 0;
        margin: 0; /* Reset ul margin */
        list-style-type: none;
      }
      .list-item {
        font-size: 11px;
        font-family: 'Open Sans', sans-serif;
        color: #1F2937;
        line-height: 1.5;
        margin-bottom: 6px;
        list-style-type: none;
        position: relative;
        padding-left: 15px;
      }
      .custom-bullet {
        content: "";
        position: absolute;
        left: 0;
        top: calc(1.5em / 2 - 2px); /* Approx vertical center */
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #0D9488; /* Deep Teal */
      }
      .languages-section { overflow: hidden; }
      .languages-list {
        padding-left: 0;
        margin:0; /* Reset ul margin */
        list-style-type: none;
      }
      .experience-section { overflow: hidden; }
      .experience-entry {
        margin-bottom: 12px;
      }
      .job-title {
        font-size: 12px;
        font-family: 'Open Sans', sans-serif;
        font-weight: 600;
        color: #1F2937;
        margin-bottom: 2px;
      }
      .company-dates {
        font-size: 11px;
        font-family: 'Open Sans', sans-serif;
        font-style: italic;
        color: #1F2937;
        margin-bottom: 4px;
      }
      .duties-list {
        font-size: 11px;
        font-family: 'Open Sans', sans-serif;
        color: #1F2937;
        line-height: 1.5;
        padding-left: 0;
        margin: 4px 0 0 0;
        list-style-type: none;
      }
      /* For print */
      @media print {
        body { background-color: #FFF; padding: 0; margin: 0;}
        .resume-container { margin: 0; box-shadow: none; width: 210mm; height: 297mm; padding: 20mm; } /* A4 size and 20mm margins for print */
      }
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume - ${name || 'Candidate'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
        <style>${styles}</style>
      </head>
      <body>
        <div class="resume-container">
          <div class="content-wrapper">
            <!-- Header -->
            <div class="header">
              <h1 class="candidate-name">${name || 'Candidate Name'}</h1>
              ${contact ? `<div class="contact-details">${contactString}</div>` : ''}
              <div class="header-divider"></div>
            </div>

            <!-- About Me -->
            ${aboutMe ? `
            <div class="section about-me-section">
              <h2 class="section-title">About Me<span class="section-title-underline"></span></h2>
              <p class="about-me-text">${aboutMe}</p>
              <div class="section-divider"></div>
            </div>` : ''}

            <!-- Skills -->
            ${skills && skills.length > 0 ? `
            <div class="section skills-section">
              <h2 class="section-title">Skills<span class="section-title-underline"></span></h2>
              <div class="skills-list-container">
                <ul class="skills-column">${skillsCol1}</ul>
                ${skills.length > 1 ? `<ul class="skills-column">${skillsCol2}</ul>` : ''}
              </div>
              <div class="section-divider"></div>
            </div>` : ''}

            <!-- Languages -->
            ${languages && languages.length > 0 ? `
            <div class="section languages-section">
              <h2 class="section-title">Languages<span class="section-title-underline"></span></h2>
              <ul class="languages-list">${languagesHtml}</ul>
              <div class="section-divider"></div>
            </div>` : ''}

            <!-- Work Experience -->
            ${workExperience && workExperience.length > 0 ? `
            <div class="section experience-section">
              <h2 class="section-title">Work Experience<span class="section-title-underline"></span></h2>
              ${workExperienceHtml}
              <!-- No divider after the last section -->
            </div>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
    return { htmlContent };
  } catch (error) {
    console.error("Error preparing HTML for download:", error);
    return { error: "Failed to prepare HTML content." };
  }
}

export async function createPaymentIntent(): Promise<{ clientSecret?: string; error?: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Stripe secret key is not configured." };
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20', 
    });

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1.00 in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("Error creating Stripe PaymentIntent:", error);
    return { error: error instanceof Error ? error.message : "An unknown error occurred while creating the payment session." };
  }
}
