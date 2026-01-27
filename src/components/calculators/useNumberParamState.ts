import { useCallback, useEffect, useMemo, useState } from "react";

function normalizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function parseNumber(value: string | null): number | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function parseBoolean(value: string | null): boolean | null {
  if (value == null) return null;
  const s = value.trim().toLowerCase();
  if (!s) return null;
  if (s === "1" || s === "true" || s === "yes" || s === "y") return true;
  if (s === "0" || s === "false" || s === "no" || s === "n") return false;
  return null;
}

function formatNumberForUrl(value: number): string {
  if (!Number.isFinite(value)) return "";
  return String(value);
}

function parseString(value: string | null): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function useNumberParamState(key: string, defaultValue: number): [number, (v: number) => void] {
  const normalizedKey = useMemo(() => normalizeKey(key), [key]);
  const [value, setValue] = useState<number>(() => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const url = new URL(window.location.href);
      const fromUrl = parseNumber(url.searchParams.get(normalizedKey));
      if (fromUrl != null) return fromUrl;
    } catch {}

    try {
      const storageKey = `cck:calc:${window.location.pathname}:${normalizedKey}`;
      const fromStorage = parseNumber(window.localStorage.getItem(storageKey));
      if (fromStorage != null) return fromStorage;
    } catch {}

    return defaultValue;
  });

  const setSafeValue = useCallback((next: number) => {
    setValue((prev) => (Number.isFinite(next) ? next : prev));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storageKey = `cck:calc:${window.location.pathname}:${normalizedKey}`;
      window.localStorage.setItem(storageKey, String(value));
    } catch {}

    try {
      const url = new URL(window.location.href);
      const serialized = formatNumberForUrl(value);
      const defaultSerialized = formatNumberForUrl(defaultValue);

      if (!serialized || serialized === defaultSerialized) url.searchParams.delete(normalizedKey);
      else url.searchParams.set(normalizedKey, serialized);

      window.history.replaceState({}, "", url.toString());
    } catch {}
  }, [defaultValue, normalizedKey, value]);

  return [value, setSafeValue];
}

export function useBooleanParamState(key: string, defaultValue: boolean): [boolean, (v: boolean) => void] {
  const normalizedKey = useMemo(() => normalizeKey(key), [key]);
  const [value, setValue] = useState<boolean>(() => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const url = new URL(window.location.href);
      const fromUrl = parseBoolean(url.searchParams.get(normalizedKey));
      if (fromUrl != null) return fromUrl;
    } catch {}

    try {
      const storageKey = `cck:calc:${window.location.pathname}:${normalizedKey}`;
      const fromStorage = parseBoolean(window.localStorage.getItem(storageKey));
      if (fromStorage != null) return fromStorage;
    } catch {}

    return defaultValue;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storageKey = `cck:calc:${window.location.pathname}:${normalizedKey}`;
      window.localStorage.setItem(storageKey, value ? "1" : "0");
    } catch {}

    try {
      const url = new URL(window.location.href);
      const serialized = value ? "1" : "0";
      const defaultSerialized = defaultValue ? "1" : "0";

      if (serialized === defaultSerialized) url.searchParams.delete(normalizedKey);
      else url.searchParams.set(normalizedKey, serialized);

      window.history.replaceState({}, "", url.toString());
    } catch {}
  }, [defaultValue, normalizedKey, value]);

  return [value, setValue];
}

export function useStringParamState(
  key: string,
  defaultValue: string,
  allowed?: readonly string[],
): [string, (v: string) => void] {
  const normalizedKey = useMemo(() => normalizeKey(key), [key]);
  const [value, setValue] = useState<string>(() => {
    if (typeof window === "undefined") return defaultValue;

    const accept = (v: string | null) => {
      if (v == null) return null;
      if (allowed && allowed.length && !allowed.includes(v)) return null;
      return v;
    };

    try {
      const url = new URL(window.location.href);
      const fromUrl = accept(parseString(url.searchParams.get(normalizedKey)));
      if (fromUrl != null) return fromUrl;
    } catch {}

    try {
      const storageKey = `cck:calc:${window.location.pathname}:${normalizedKey}`;
      const fromStorage = accept(parseString(window.localStorage.getItem(storageKey)));
      if (fromStorage != null) return fromStorage;
    } catch {}

    return defaultValue;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storageKey = `cck:calc:${window.location.pathname}:${normalizedKey}`;
      window.localStorage.setItem(storageKey, value);
    } catch {}

    try {
      const url = new URL(window.location.href);
      if (value === defaultValue) url.searchParams.delete(normalizedKey);
      else url.searchParams.set(normalizedKey, value);
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }, [defaultValue, normalizedKey, value]);

  return [value, setValue];
}
