/**
 * Tests for the visitor-info extractors used by the agents runner.
 *
 * The bug these guard against: a visitor types "Sarah Mendez,
 * 949-555-0142, sarah@derma.co" into the chat and the runner used to
 * leave support_sessions.visitor_* untouched, so no SMS alert ever
 * fired. Each extractor must (a) recognize realistic chat shapes and
 * (b) refuse to confuse stats-speak for contact info.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";

import { extractEmail, extractName, extractPhone } from "./extractors.ts";

// ── extractPhone ──────────────────────────────────────────────────────────

test("extractPhone normalizes 949-555-0142 → +19495550142", () => {
  assert.equal(extractPhone("949-555-0142"), "+19495550142");
});

test("extractPhone normalizes (949) 555-0142 → +19495550142", () => {
  assert.equal(extractPhone("(949) 555-0142"), "+19495550142");
});

test("extractPhone passes through E.164 +19495550142", () => {
  assert.equal(extractPhone("+19495550142"), "+19495550142");
});

test("extractPhone normalizes bare 10 digits 9495550142 → +19495550142", () => {
  assert.equal(extractPhone("9495550142"), "+19495550142");
});

test("extractPhone handles dot-separated 949.555.0142", () => {
  assert.equal(extractPhone("949.555.0142"), "+19495550142");
});

test("extractPhone handles space-separated 949 555 0142", () => {
  assert.equal(extractPhone("949 555 0142"), "+19495550142");
});

test("extractPhone handles 1-949-555-0142", () => {
  assert.equal(extractPhone("Call me at 1-949-555-0142 anytime"), "+19495550142");
});

test("extractPhone finds the number embedded in a chat sentence", () => {
  assert.equal(
    extractPhone("Sarah Mendez, 949-555-0142, sarah@derma.co"),
    "+19495550142"
  );
});

test("extractPhone returns null for '200 calls/week'", () => {
  assert.equal(extractPhone("we get about 200 calls/week"), null);
});

test("extractPhone returns null for '20-35%'", () => {
  assert.equal(extractPhone("20-35% of those go to voicemail"), null);
});

test("extractPhone returns null for 'in 2024'", () => {
  assert.equal(extractPhone("we started in 2024"), null);
});

test("extractPhone returns null for '$1500/month'", () => {
  assert.equal(extractPhone("budget is around $1500/month"), null);
});

test("extractPhone returns null for an 11-digit-in-a-row order id", () => {
  assert.equal(extractPhone("order 20240501123 is stuck"), null);
});

test("extractPhone returns null for empty / no-digit input", () => {
  assert.equal(extractPhone(""), null);
  assert.equal(extractPhone("hi there"), null);
});

// ── extractEmail ──────────────────────────────────────────────────────────

test("extractEmail finds a plain address", () => {
  assert.equal(extractEmail("sarah@derma.co"), "sarah@derma.co");
});

test("extractEmail finds an address with dots and pluses", () => {
  assert.equal(
    extractEmail("contact me at sarah.m+lead@derma.co please"),
    "sarah.m+lead@derma.co"
  );
});

test("extractEmail returns null when no @ is present", () => {
  assert.equal(extractEmail("sarah at derma dot co"), null);
});

test("extractEmail returns null for empty input", () => {
  assert.equal(extractEmail(""), null);
});

// ── extractName ───────────────────────────────────────────────────────────

test("extractName matches \"I'm Sarah\"", () => {
  assert.equal(extractName("Hi, I'm Sarah"), "Sarah");
});

test("extractName matches \"I'm Sarah Mendez\"", () => {
  assert.equal(extractName("I'm Sarah Mendez and I run a med spa"), "Sarah Mendez");
});

test("extractName matches \"my name is Sarah Mendez\"", () => {
  assert.equal(extractName("my name is Sarah Mendez"), "Sarah Mendez");
});

test("extractName matches \"this is Sarah\"", () => {
  assert.equal(extractName("Hey, this is Sarah from the med spa"), "Sarah");
});

test("extractName matches a leading 'First Last,' before contact info", () => {
  assert.equal(
    extractName("Sarah Mendez, 949-555-0142, sarah@derma.co"),
    "Sarah Mendez"
  );
});

test("extractName rejects 'I'm running a med spa' (lowercase verb)", () => {
  assert.equal(extractName("I'm running a med spa"), null);
});

test("extractName rejects 'I'm super excited'", () => {
  assert.equal(extractName("I'm super excited about this"), null);
});

test("extractName returns null for messages with no intro pattern", () => {
  assert.equal(extractName("Tell me about pricing"), null);
});

test("extractName returns null for empty input", () => {
  assert.equal(extractName(""), null);
});
