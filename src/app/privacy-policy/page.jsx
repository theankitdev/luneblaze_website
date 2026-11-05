// src/components/legal/PrivacyPolicyPage.jsx
import LegalHero from "@/components/legal/LegalHero";
import LegalBody from "@/components/legal/LegalBody";

const SECTIONS = [
  {
    id: "s1",
    num: 1,
    title: "Information We Collect",
    lede: "What we collect, and when.",
    blocks: [
      {
        type: "para",
        lead: "Information you provide to us.",
        text: "To create an account you provide data including your name, email address or mobile number, and a password. We may ask you for payment and billing information. To deal with fake accounts, we may ask for your Aadhaar (UID) number for verification.",
      },
      {
        type: "para",
        lead: "Profile.",
        text: "You have choices about the information on your profile — education, work experience, interests, photo, city or area. Profile information helps you get more from our Services. It is your choice whether to include sensitive information; please do not add personal data you do not want publicly available.",
      },
      {
        type: "para",
        lead: "Posting and uploading.",
        text: "We collect personal data when you provide, post or upload it — filling out a session form, or sending invitations for connections, sessions, questions and interests. If you import your address book we receive your contacts. If you sync email or calendars we collect your email header and calendar meeting information.",
      },
      {
        type: "para",
        lead: "Information from others.",
        text: "You and others may post content that includes information about you, as part of blog posts, feed updates and comments. We collect public information from these sources.",
      },
      {
        type: "para",
        lead: "Service use.",
        text: "We log usage data when you visit or use our Services — viewing or clicking content, performing a search, installing an app, sharing articles or conducting sessions. We use log-ins, cookies, device information and IP addresses to identify you and log your use.",
      },
      {
        type: "para",
        lead: "Session data.",
        text: "We collect session data such as photos, videos and questions or answers during a session. We only keep the photos and videos uploaded to the session page.",
      },
      {
        type: "para",
        lead: "Cookies and similar technologies.",
        text: "We use cookies, web beacons, pixels, ad tags and device identifiers to recognise you and your devices across Services. You can control cookies through your browser settings and other tools.",
      },
      {
        type: "para",
        lead: "Your device and location.",
        text: "We receive the URL of the site you came from and the one you go to next, along with your IP address, proxy server, operating system, browser, device identifier and ISP or mobile carrier. Most devices let you prevent location data being sent, and we honour your settings.",
      },
      {
        type: "para",
        lead: "Messages.",
        text: "We collect information when you send, receive or engage with messages in connection with our Services. If you receive an Add Fellow request we track whether you have acted on it and may send reminders.",
      },
      {
        type: "para",
        lead: "Other.",
        text: "Our Services are dynamic and we often introduce new features, which may require collecting new information. If we collect materially different personal data, or materially change how we use it, we will notify you and may modify this Policy.",
      },
    ],
  },
  {
    id: "s2",
    num: 2,
    title: "How We Use Your Data",
    lede: "We use your data to provide, support, personalise and develop our Services.",
    blocks: [
      {
        type: "para",
        text: "How we use your personal data depends on which Services you use, how you use them, and the choices you make in your settings.",
      },
      {
        type: "para",
        lead: "Services.",
        text: "We use your data to authenticate you and authorise access. Our Services let you stay connected with people of your interest, stay informed about news, sessions and ideas you care about, and learn by initiating or conducting sessions.",
      },
      {
        type: "para",
        lead: "Communications.",
        text: "We contact you by email, messages to your Luneblaze inbox, text messages and push notifications about availability, security and service-related issues, as well as network updates, reminders and suggestions. You may change your preferences at any time, but you cannot opt out of service messages including security and legal notices.",
      },
      {
        type: "para",
        lead: "Advertising.",
        text: "We target and measure ads using data from advertising technologies, member-provided information, data from your use of our Services, and information from partners. You can opt out of any ad at any time.",
      },
      {
        type: "para",
        lead: "Info to advertisers.",
        text: "We do not share your data with third-party advertisers or ad networks for their advertising without your separate permission. If you click an ad, the ad poster will know you visited the page you clicked on.",
      },
      {
        type: "para",
        lead: "Marketing, research and support.",
        text: "We use data and content for invitations and communications promoting membership and engagement, to conduct research and development, and to investigate, respond to and resolve complaints and service issues.",
      },
      {
        type: "para",
        lead: "Aggregate insights and security.",
        text: "We produce aggregate insights that do not identify you, and use your data where necessary for security, fraud prevention and investigations into possible violations of our User Agreement or this Policy.",
      },
    ],
  },
  {
    id: "s3",
    num: 3,
    title: "How We Share Information",
    lede: "What others can see, and who we share with.",
    blocks: [
      {
        type: "para",
        lead: "Our Services.",
        text: "Any information on your profile, and any content or social action you take — likes, follows, comments, shares, questions, answers, thanks, attends, accepts, upvotes — will be seen by others.",
      },
      {
        type: "list",
        items: [
          "Your profile is visible to all Members and customers of our Services; your settings, degree of connection and access channel affect availability of certain fields.",
          "When you share a post, the default is public, and others who are not your connections can find and see it.",
          "When you like, comment on or share another's post, others will see it, including the person who initiated it.",
          "If you initiate or conduct a session, your friends and the session attendees can see it, and people following the same venue receive a notification.",
          "When you follow a person, interest or venue you are visible as a follower; we provide aggregate insights to page owners.",
          "We let senders know when you act on their message.",
        ],
      },
      {
        type: "para",
        lead: "Service providers.",
        text: "We use others to help provide our Services — maintenance, analysis, audit, payments, fraud detection, marketing and development. They access your information only as reasonably necessary and are obliged not to disclose or use it for other purposes.",
      },
      {
        type: "para",
        lead: "Legal disclosures.",
        text: "We may disclose information when required by law, subpoena or other legal process, or where we have a good-faith belief it is reasonably necessary to investigate illegal activity, enforce our agreements, defend against claims, protect the security of our Service, or protect the rights and safety of Luneblaze, our Members and others.",
      },
      {
        type: "para",
        lead: "Change in control or sale.",
        text: "We may share your personal data as part of a sale, merger or change in control. Any entity that buys us will have the right to continue using your data, but only as set out in this Policy unless you agree otherwise.",
      },
    ],
  },
  {
    id: "s4",
    num: 4,
    title: "Your Choices and Obligations",
    lede: "You can access or delete your personal data.",
    blocks: [
      {
        type: "para",
        lead: "Data retention.",
        text: "We retain the personal data you provide while your account exists or as needed to provide you Services. We keep your information and your profile open until you decide to close your account.",
      },
      {
        type: "para",
        lead: "Rights to access and control.",
        text: "We provide choices about the collection, use and sharing of your data — from deleting or correcting profile data and controlling post visibility, to advertising opt-outs and communication controls. We offer access to the personal data we hold about you.",
      },
      {
        type: "para",
        lead: "Account closure.",
        text: "If you close your account, your data generally stops being visible to others within 24 hours, and we generally delete closed account information within 30 days. We retain data where reasonably necessary to comply with legal obligations, meet regulatory requirements, resolve disputes, maintain security, prevent fraud and abuse, or enforce our User Agreement. Information you have shared with others remains visible after closure.",
      },
    ],
  },
  {
    id: "s5",
    num: 5,
    title: "Other Important Information",
    lede: "Security, marketing signals and how to reach us.",
    blocks: [
      {
        type: "para",
        lead: "Security.",
        text: "We implement safeguards designed to protect your data, such as HTTPS, and regularly monitor our systems for vulnerabilities and attacks. However we cannot warrant the security of any information you send us, and there is no guarantee data may not be accessed, disclosed, altered or destroyed by breach of our physical, technical or managerial safeguards.",
      },
      {
        type: "para",
        lead: "Direct marketing and Do Not Track.",
        text: "We do not share personal data with third parties for their direct marketing purposes without your permission.",
      },
      {
        type: "para",
        lead: "Contact.",
        text: "If you have questions or complaints regarding this Policy, please contact Luneblaze by filling in the contact form on the website, or write to contact@luneblaze.com.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalHero eyebrow="Privacy" title="Privacy Policy" />
      <LegalBody sections={SECTIONS} contactEmail="contact@luneblaze.com" />
    </>
  );
}