import { generateAiReply } from "./agent.js";

async function runTests() {
  console.log("================================================================");
  console.log("🤖 TESTING AUTONOMOUS BILINGUAL WHATSAPP AI AGENT (OPTION 2)");
  console.log("================================================================\n");

  const scenarios = [
    {
      title: "Scenario 1: Nepali Customer asking for Skyworth TV Price",
      input: "नमस्ते हजुर! Skyworth ko 55 inch TV ko price kati parcha hola?",
    },
    {
      title: "Scenario 2: English Customer asking for Whirlpool Refrigerator",
      input: "Hello, what is the price and warranty of Whirlpool frost-free refrigerator in Kathmandu?",
    },
    {
      title: "Scenario 3: Old Appliance Trade-In / Exchange Inquiry",
      input: "Mero purano 32 inch CRT TV cha, exchange ma kasto offer cha?",
    },
    {
      title: "Scenario 4: EMI Installment Financing",
      input: "How can I buy a washing machine on monthly EMI installment?",
    },
    {
      title: "Scenario 5: Lead Submission with Phone Number",
      input: "Mero number 9851099888 ho, Samakhushi delivery gardinus na",
    },
  ];

  for (const s of scenarios) {
    console.log(`💬 [INPUT] ${s.title}`);
    console.log(`   User: "${s.input}"`);
    const reply = await generateAiReply(s.input, "test_user");
    console.log(`🤖 [BOT REPLY]:\n${reply}\n`);
    console.log("----------------------------------------------------------------\n");
  }

  console.log("✅ All 5 bilingual WhatsApp test scenarios executed successfully!");
}

runTests();
