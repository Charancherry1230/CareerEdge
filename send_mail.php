<?php
// iGenuine FresherXEdge: emails Register and Contact Us submissions to the helpdesk.
// Same approach as igenuinelearning.com's send_mail.php: PHP mail() on the host.

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const TO   = 'helpdesk@igenuinelearning.com';
// Must be a mailbox on the sending domain, or SPF/DMARC will push mail to spam.
const FROM = 'no-reply@igenuinelearning.com';

function reply(int $code, array $body): void {
    http_response_code($code);
    echo json_encode($body);
    exit;
}

// mbstring isn't enabled on every host; fall back to byte-safe substr.
function cut(string $v, int $max): string {
    return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}

// Single-line value: no CR/LF (blocks header injection), trimmed, capped.
function line(string $key, int $max = 200): string {
    $v = isset($_POST[$key]) && is_string($_POST[$key]) ? $_POST[$key] : '';
    return cut(trim(preg_replace('/[\r\n\t]+/', ' ', $v)), $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// Honeypot: real people never see or fill this field.
if (line('website') !== '') {
    reply(200, ['ok' => true]);
}

$type  = line('form_type') === 'registration' ? 'registration' : 'contact';
$name  = line('name', 120);
$email = line('email', 160);
$phone = line('phone', 20);

$errors = [];
if ($name === '') $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (!preg_match('/^[0-9+\s\-]{8,16}$/', $phone)) $errors[] = 'phone';

if ($type === 'registration') {
    $fields = [
        'Full name'          => $name,
        'Email'              => $email,
        'Phone'              => $phone,
        'College'            => line('college'),
        'Branch'             => line('branch', 60),
        'Year of graduation' => line('year', 30),
        'CGPA'               => line('cgpa', 10),
        'Experience'         => line('experience', 30),
        'Domain of interest' => line('domain', 60),
    ];
    foreach (['College', 'Branch', 'Year of graduation', 'Experience', 'Domain of interest'] as $k) {
        if ($fields[$k] === '') $errors[] = $k;
    }
    if (!is_numeric($fields['CGPA']) || $fields['CGPA'] < 0 || $fields['CGPA'] > 10) $errors[] = 'cgpa';
    $subject = 'New FresherXEdge registration: ' . $name;
} else {
    $message = isset($_POST['message']) && is_string($_POST['message'])
        ? cut(trim($_POST['message']), 4000) : '';
    if ($message === '') $errors[] = 'message';
    $fields = [
        'Full name'    => $name,
        'Email'        => $email,
        'Phone'        => $phone,
        'Organization' => line('organization') ?: '—',
    ];
    $subject = 'FresherXEdge enquiry: ' . $name;
}

if ($errors) {
    reply(422, ['ok' => false, 'error' => 'Please check: ' . implode(', ', $errors)]);
}

$body = ($type === 'registration' ? "New registration from the FresherXEdge website\n\n" : "New enquiry from the FresherXEdge Contact Us form\n\n");
foreach ($fields as $label => $value) {
    $body .= str_pad($label . ':', 20) . $value . "\n";
}
if ($type === 'contact') {
    $body .= "\nMessage:\n" . $message . "\n";
}
$body .= "\n—\nSubmitted " . date('d M Y, H:i') . ' from ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown IP') . "\n";

$headers = implode("\r\n", [
    'From: iGenuine FresherXEdge <' . FROM . '>',
    'Reply-To: ' . $email,             // validated above, safe in a header
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: FresherXEdge',
]);

$sent = @mail(TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . FROM);

$sent
    ? reply(200, ['ok' => true])
    : reply(500, ['ok' => false, 'error' => 'Mail server unavailable']);
