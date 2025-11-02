/**
 * Google Apps Script - RSVP collector
 *
 * ISTRUZIONI
 * 1. Crea un nuovo progetto Apps Script (https://script.google.com/)
 * 2. Crea un Google Sheet e copia l'ID nel placeholder SPREADSHEET_ID qui sotto.
 * 3. Incolla questo file nel project editor (File > Nuovo > Script).
 * 4. Deploy > Nuovo deployment > Tipo: App web > Esegui come: Me > Accesso: Chiunque.
 * 5. Copia l'URL (termina con /exec) e incollalo in NEXT_PUBLIC_RSVP_ENDPOINT.
 *
 * NOTA CORS: il client invia FormData (multipart/form-data) senza header custom,
 * quindi non serve gestire preflight/OPTIONS. Non aggiungere header custom lato client.
 */

const SPREADSHEET_ID = 'SOSTITUISCI_CON_LO_SPREADSHEET_ID'
const SHEET_NAME = 'RSVP'

/**
 * Gestisce POST da fetch() con FormData o x-www-form-urlencoded.
 * Accetta: nome, email, presenze, messaggio, userAgent, timestamp.
 */
function doPost(e) {
  try {
    var p = (e && e.parameter) || {}

    // Se arriva JSON (non consigliato per CORS), prova a parse
    if ((!p || Object.keys(p).length === 0) && e && e.postData && e.postData.contents) {
      try {
        p = JSON.parse(e.postData.contents)
      } catch (_) {}
    }

    var nome = String(p.nome || '').trim()
    var email = String(p.email || '').trim()
    var presenze = Number(p.presenze || 0)
    var messaggio = String(p.messaggio || '')
    var userAgent = String(p.userAgent || '')
    var timestamp = String(p.timestamp || new Date().toISOString())
    var recaptchaToken = String(p.recaptchaToken || '')

    if (!nome || !email || !presenze || presenze < 1) {
      return json({ ok: false, error: 'Dati non validi' }, 400)
    }

    // Optional reCAPTCHA v3 verification (recommended)
    var secret = PropertiesService.getScriptProperties().getProperty('RECAPTCHA_SECRET')
    if (secret) {
      var verified = verifyRecaptcha(secret, recaptchaToken)
      if (!verified.ok) {
        return json({ ok: false, error: 'reCAPTCHA non valido', details: verified }, 403)
      }
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID)
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Timestamp', 'Nome', 'Email', 'Presenze', 'Messaggio', 'UserAgent'])
    }
    sh.appendRow([new Date(), nome, email, presenze, messaggio, userAgent])

    return json({ ok: true })
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500)
  }
}

function json(obj, status) {
  var out = ContentService.createTextOutput(JSON.stringify(obj))
  out.setMimeType(ContentService.MimeType.JSON)
  // Apps Script non supporta setHeader su ContentService per CORS.
  // Usando FormData lato client, nessun preflight necessario.
  return out
}

/**
 * Verifica reCAPTCHA v3 con chiave segreta salvata in Script Properties
 */
function verifyRecaptcha(secret, token) {
  if (!token) return { ok: false, reason: 'missing_token' }
  try {
    var resp = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'post',
      payload: { secret: secret, response: token },
      muteHttpExceptions: true,
    })
    var data = JSON.parse(resp.getContentText())
    // data: { success, score, action, challenge_ts, hostname }
    if (!data.success) return { ok: false, reason: 'api_fail', data: data }
    if (typeof data.score === 'number' && data.score < 0.5) return { ok: false, reason: 'low_score', data: data }
    return { ok: true, data: data }
  } catch (e) {
    return { ok: false, reason: 'exception', error: String(e) }
  }
}
