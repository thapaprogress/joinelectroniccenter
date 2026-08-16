import makeWASocketPkg, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import pino from "pino";
import path from "path";
import { fileURLToPath } from "url";
import { generateAiReply } from "./agent.js";

const makeWASocket = makeWASocketPkg.default || makeWASocketPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_DIR = path.resolve(__dirname, "../auth_info_baileys");

// Store owner notification numbers
const OWNER_JIDS = [
  "9779851045662@s.whatsapp.net",
  "9779765985999@s.whatsapp.net"
];

console.log("🚀 Initializing Join Electronic Center WhatsApp AI Bot Gateway with Owner Alerts...");

async function startWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "info" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n==================================================");
      console.log("📱 SCAN THIS QR CODE WITH WHATSAPP TO LINK BOT:");
      console.log("==================================================\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("WhatsApp connection closed. Reconnecting:", shouldReconnect);
      if (shouldReconnect) {
        setTimeout(startWhatsAppBot, 3000);
      }
    } else if (connection === "open") {
      console.log("✅ Join Electronic Center WhatsApp AI Bot Connected & Online!");
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      "";

    if (!body) return;

    console.log(`\n📩 Incoming WhatsApp from ${from}: "${body}"`);

    try {
      // 1. Generate & Send Customer AI Reply
      const replyText = await generateAiReply(body, from);
      await sock.sendMessage(from, { text: replyText });
      console.log(`📤 AI Replied to ${from}`);

      // 2. Check for Lead / Phone Number Submission & Alert Owner
      const phoneMatch = body.match(/(?:98|97)\d{8}/);
      if (phoneMatch) {
        const alertMsg = `🔔 *NEW CUSTOMER LEAD ALERT!*\n\n📱 Customer Phone: *${phoneMatch[0]}*\n💬 Message: "${body}"\n🕒 Time: ${new Date().toLocaleString("en-NP")}\n\n_Auto-logged to Showroom Inquiries database._`;
        
        console.log(`\n[ALERT TRIGGERED] Sending owner notification to ${OWNER_JIDS.join(", ")}`);
        for (const ownerJid of OWNER_JIDS) {
          if (from !== ownerJid) {
            try {
              await sock.sendMessage(ownerJid, { text: alertMsg });
            } catch (err) {
              console.error(`Failed to alert ${ownerJid}:`, err.message);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error generating reply / sending alert:", err);
    }
  });
}

// Start bot
startWhatsAppBot().catch((err) => console.error("Fatal bot error:", err));
