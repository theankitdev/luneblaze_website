// src/components/legal/TermsPage.jsx
import LegalHero from "@/components/legal/LegalHero";
import LegalBody from "@/components/legal/LegalBody";

const SECTIONS = [
  {
    id: "s1",
    num: 1,
    title: "Acceptance of These Terms",
    lede: "By using Luneblaze you agree to these Terms.",
    blocks: [
      {
        type: "para",
        text: "These Terms and Rules govern your access to and use of the Luneblaze platform and services, operated by Avadna Services Pvt Ltd. By creating an account, accessing the platform or using any of our services, you agree to be bound by these Terms.",
      },
      {
        type: "para",
        text: "If you are using Luneblaze on behalf of an institution, you confirm that you are authorised to accept these Terms on that institution's behalf, and that the institution accepts them.",
      },
    ],
  },
  {
    id: "s2",
    num: 2,
    title: "Your Account",
    lede: "You are responsible for your account and its activity.",
    blocks: [
      {
        type: "para",
        text: "You must provide accurate and complete information when creating an account, and keep it current. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account.",
      },
      {
        type: "para",
        text: "Institutional accounts may include multiple users under role-based access. The institution is responsible for managing which of its personnel hold which roles, and for revoking access when a person leaves.",
      },
      {
        type: "para",
        text: "Notify us promptly at contact@luneblaze.com if you believe your account has been accessed without authorisation.",
      },
    ],
  },
  {
    id: "s3",
    num: 3,
    title: "Acceptable Use",
    lede: "What you may and may not do on the platform.",
    blocks: [
      {
        type: "para",
        text: "You agree to use Luneblaze only for lawful purposes and in accordance with these Terms. You must not:",
      },
      {
        type: "list",
        items: [
          "Upload or share content you do not have the right to share, or that infringes the intellectual property of others.",
          "Misrepresent your institution, your role, or any evidence or documentation submitted through the platform.",
          "Attempt to gain unauthorised access to any part of the platform, other accounts, or connected systems.",
          "Interfere with or disrupt the integrity or performance of the platform, or attempt to circumvent security measures.",
          "Use the platform to store or transmit malicious code, or for any purpose that violates applicable law.",
          "Resell, sublicense or otherwise commercially exploit the platform without our written consent.",
        ],
      },
    ],
  },
  {
    id: "s4",
    num: 4,
    title: "Institutional Content and Evidence",
    lede: "Your data remains yours.",
    blocks: [
      {
        type: "para",
        text: "You retain ownership of the documents, evidence, assessment responses and other content your institution uploads. You grant Luneblaze a limited licence to host, process and display that content solely to provide the services to you.",
      },
      {
        type: "para",
        text: "You are responsible for the accuracy of assessment responses and the authenticity of evidence uploaded. Luneblaze provides the system of record; it does not certify or validate the truth of submitted content.",
      },
      {
        type: "para",
        text: "Luneblaze is not an accrediting body. We prepare institutions for frameworks including SQAAF, NABET, NAAC, NBA and NIRF, but accreditation decisions, grades and rankings rest entirely with the respective framework authorities.",
      },
    ],
  },
  {
    id: "s5",
    num: 5,
    title: "Subscriptions, Fees and Payments",
    lede: "How commercial terms work.",
    blocks: [
      {
        type: "para",
        text: "Access to Luneblaze is provided on a subscription basis, with the scope, term and fees set out in your order or agreement. Fees are payable in advance unless otherwise agreed in writing.",
      },
      {
        type: "para",
        text: "Paid webinars, training sessions and advisory engagements are charged separately at the rate shown at the point of registration. Registration fees are non-refundable once a session has been delivered.",
      },
      {
        type: "para",
        text: "We may revise our pricing. Where a change affects an active subscription, we will give notice before it takes effect at renewal.",
      },
    ],
  },
  {
    id: "s6",
    num: 6,
    title: "Intellectual Property",
    lede: "What belongs to Luneblaze.",
    blocks: [
      {
        type: "para",
        text: "The platform, its interface, document frameworks, templates, Readiness Score™ methodology, analytics models, and all associated software and materials are the intellectual property of Avadna Services Pvt Ltd and its licensors.",
      },
      {
        type: "para",
        text: "You may use framework templates and generated documents for your own institution's quality and accreditation purposes. You may not redistribute, resell or publish them as your own work product.",
      },
      {
        type: "para",
        text: "Framework names, logos and marks including SQAAF, NABET, NAAC, NBA and NIRF belong to their respective bodies and are referenced here for identification only.",
      },
    ],
  },
  {
    id: "s7",
    num: 7,
    title: "Service Availability and Support",
    lede: "What you can expect from us.",
    blocks: [
      {
        type: "para",
        text: "We aim to keep the platform available at all times, but access may be interrupted for maintenance, updates or reasons outside our control. We will give advance notice of planned maintenance where practicable.",
      },
      {
        type: "para",
        text: "Support is provided through the channels set out in your agreement. Expert advisory and implementation guidance are provided as described in your subscription scope.",
      },
    ],
  },
  {
    id: "s8",
    num: 8,
    title: "Limitation of Liability",
    lede: "The limits of our responsibility.",
    blocks: [
      {
        type: "para",
        text: "To the fullest extent permitted by law, Luneblaze is not liable for indirect, incidental, special or consequential losses, nor for loss of accreditation status, grade, rank, funding or reputation arising from your use of, or inability to use, the platform.",
      },
      {
        type: "para",
        text: "Nothing in these Terms limits liability that cannot be limited under applicable law.",
      },
    ],
  },
  {
    id: "s9",
    num: 9,
    title: "Suspension and Termination",
    lede: "How access can end.",
    blocks: [
      {
        type: "para",
        text: "You may stop using the platform and close your account at any time. We may suspend or terminate access where these Terms are breached, where fees remain unpaid, or where continued access poses a security or legal risk.",
      },
      {
        type: "para",
        text: "On termination we will make your institutional data available for export for a reasonable period before deletion, in accordance with our Privacy Policy.",
      },
    ],
  },
  {
    id: "s10",
    num: 10,
    title: "Changes, Governing Law and Contact",
    lede: "How these Terms change, and where disputes are heard.",
    blocks: [
      {
        type: "para",
        text: "We may update these Terms from time to time. Where changes are material we will notify you, and continued use after the effective date constitutes acceptance.",
      },
      {
        type: "para",
        text: "These Terms are governed by the laws of India, and the courts at Faridabad, Haryana shall have jurisdiction over any dispute arising from them.",
      },
      {
        type: "para",
        text: "For any question about these Terms, contact us at contact@luneblaze.com or +91 88104 18840.",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <LegalHero
        eyebrow="Terms"
        title="Terms and Rules"
        intro="These Terms set out the basis on which institutions and their people use the Luneblaze platform. They cover your account, acceptable use, ownership of your institutional content, commercial terms and the limits of our responsibility. Please read them before using the platform."
      />
      <LegalBody sections={SECTIONS} contactEmail="contact@luneblaze.com" />
    </>
  );
}