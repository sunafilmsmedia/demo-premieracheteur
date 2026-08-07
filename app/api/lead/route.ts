import { NextResponse } from "next/server";
import { Answers } from "@/lib/types";
import { config, LEAD_TYPE } from "@/lib/config";
import { scoreAnswers } from "@/lib/scoring";
import { evaluateQualification } from "@/lib/qualification";
import { broker } from "@/lib/broker";

export const runtime = "nodejs";

interface LeadBody {
  name?: string;
  email?: string;
  phone?: string;
  consent?: boolean;
  answers?: Answers;
  leadType?: string;
}

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { name, email, phone, consent, answers } = body;

  if (
    !name?.trim() ||
    !email?.includes("@") ||
    !phone?.trim() ||
    !consent ||
    !answers
  ) {
    return NextResponse.json({ error: "missing_fields" }, { status: 422 });
  }

  const scoring = scoreAnswers(answers);
  const qualification = evaluateQualification(answers, scoring);

  if (!qualification.store) {
    return NextResponse.json({ ok: true, stored: false, reason: qualification.reason });
  }

  if (!config.WEBHOOK_URL) {
    // Pas de webhook configuré : on confirme sans transmettre.
    return NextResponse.json({ ok: true, stored: false, reason: "no_webhook" });
  }

  const [firstName, ...rest] = name.trim().split(/\s+/);
  const lastName = rest.join(" ");
  const receivedAt = new Date().toISOString();

  const payload = {
    source: broker.name,
    leadType: body.leadType ?? LEAD_TYPE,
    firstName,
    lastName,
    fullName: name.trim(),
    email,
    phone,
    leadScore: scoring.score,
    leadSegment: scoring.segment,
    projectFit: scoring.projectFit,
    secondaryTags: scoring.secondaryTags,
    downPayment: answers.downPayment,
    region: answers.region,
    propertyType: answers.propertyType,
    bedrooms: answers.bedrooms,
    mustHaves: answers.mustHaves,
    firstTimeBuyer: answers.firstTimeBuyer,
    purchaseTimeline: answers.purchaseTimeline,
    currentHousing: answers.currentHousing,
    ownerStrategy: answers.ownerStrategy,
    salePreparation: answers.salePreparation,
    buyingWith: answers.buyingWith,
    consent,
    receivedAt,
    // objets imbriqués
    lead: { name: name.trim(), email, phone, consent },
    scoring,
    qualification,
    answers,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (config.WEBHOOK_SECRET) headers["X-Webhook-Secret"] = config.WEBHOOK_SECRET;

    await fetch(config.WEBHOOK_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json({ ok: true, stored: false, reason: "webhook_error" });
  }

  return NextResponse.json({ ok: true, stored: true });
}
