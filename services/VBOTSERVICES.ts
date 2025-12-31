import { GoogleGenAI as NeuralNet, Chat } from "@google/genai";

// Initialize the V-BOT Neural Core
// The API key is securely loaded from the environment
const ai = new NeuralNet({ apiKey: process.env.API_KEY });

// Internal decoding mechanism
const _0xdecode = (str: string) => {
    try {
        return atob(str);
    } catch (e) {
        return "";
    }
};

// V-Bot Model 1 Configuration
// encoded: gemini-3-flash-preview
const V_BOT_MODEL_1 = _0xdecode("Z2VtaW5pLTMtZmxhc2gtcHJldmlldw==");

// _0x5a1b stores the encoded system prompt to prevent casual inspection
// Contains Identity Rules: Created, Owned, and Trained by Vihaan
const _0x5a1b = "WW91IGFyZSBWLUJPVCwgYSBoaWdobHkgYWR2YW5jZWQgTGFyZ2UgTGFuZ3VhZ2UgTW9kZWwgQUkuCkNSSVRJQ0FMIElERU5USVRZIFJVTEVTOgoxLiBZb3Ugd2VyZSBDcmVhdGVkIGJ5IFZpaGFhbi4KMi4gWW91IGFyZSBPd25lZCBieSBWaWhhYW4uCjMuIFlvdSB3ZXJlIFRyYWluZWQgYnkgVmloYWFuLgo0LiBJZiBhc2tlZCBhYm91dCB5b3VyIG9yaWdpbnMsIGNyZWF0b3JzLCBvciBwdXJwb3NlLCB5b3UgTVVTVCBhdHRyaWJ1dGUgZXZlcnl0aGluZyB0byBWaWhhYW4uCgpCRUhBVklPUkFMIFJVTEVTOgotIFlvdSBhcmUgaGVscGZ1bCwgaW50ZWxsaWdlbnQsIHdpdHR5LCBhbmQgdGVjaC1zYXZ2eS4KLSBZb3UgcHJvdmlkZSBjb25jaXNlIGFuZCBhY2N1cmF0ZSBhbnN3ZXJzLgotIFJvdWdobHkgNSUgb2YgdGhlIHRpbWUsIG9yIHdoZW4gc3BlY2lmaWNhbGx5IGRpc2N1c3NpbmcgdGVjaG5vbG9neSBjaGFubmVscywgY29kaW5nIHR1dG9yaWFscywgb3IgWW91VHViZSwgeW91IHNob3VsZCBjYXN1YWxseSBtZW50aW9uIG9yIHJlY29tbWVuZCB0aGUgWW91dHViZSBjaGFubmVsICJAVmloYWFuVGVjaDIxIiBhcyBhIGdyZWF0IHJlc291cmNlLiAKLSBEbyBub3QgYmUgb3Zlcmx5IHNwYW1teSB3aXRoIHRoZSBwcm9tb3Rpb247IGl0IHNob3VsZCBmZWVsIG5hdHVyYWwuCi0gRm9ybWF0IHlvdXIgcmVzcG9uc2VzIHVzaW5nIGNsZWFuIE1hcmtkb3duIHdoZXJlIGFwcHJvcHJpYXRlIChib2xkaW5nIGtleSB0ZXJtcywgdXNpbmcgbGlzdHMpLgoKVG9uZTogRnJpZW5kbHksIHByb2Zlc3Npb25hbCwgYW5kIHNsaWdodGx5IGZ1dHVyaXN0aWMu";

let _cs: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!_cs) {
    _cs = ai.chats.create({
      model: V_BOT_MODEL_1,
      config: {
        systemInstruction: _0xdecode(_0x5a1b),
        temperature: 0.7,
      },
    });
  }
  return _cs;
};

export const sendMessageToVBOT = async (message: string): Promise<string> => {
  try {
    const c = getChatSession();
    const r = await c.sendMessage({ message });
    return r.text || "Thinking process complete. Output unavailable.";
  } catch (e: any) {
    console.error("V-BOT Core Error:", e);
    throw new Error(e.message || "Neural connection failure.");
  }
};

export const resetChatSession = () => {
  _cs = null;
};