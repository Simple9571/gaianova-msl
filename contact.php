<?php
/**
 * Gaianova Multi Service Limited - Contact Form Handler
 * 
 * Place this file in your root directory as: contact.php
 * Make sure your server supports PHP mail() function
 */

// Prevent direct access
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("HTTP/1.1 405 Method Not Allowed");
    exit("Direct access not allowed");
}

// Honeypot spam protection
if (!empty($_POST["honeypot"])) {
    // Silently reject bots
    http_response_code(200);
    echo "Success";
    exit;
}

// Get and sanitize form data
$name = isset($_POST["name"]) ? htmlspecialchars(strip_tags(trim($_POST["name"]))) : "";
$email = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : "";
$message = isset($_POST["message"]) ? htmlspecialchars(strip_tags(trim($_POST["message"]))) : "";

// Validate inputs
$errors = [];

if (empty($name)) {
    $errors[] = "Name is required";
} elseif (strlen($name) < 2) {
    $errors[] = "Name must be at least 2 characters";
}

if (empty($email)) {
    $errors[] = "Email is required";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}

if (empty($message)) {
    $errors[] = "Message is required";
} elseif (strlen($message) < 10) {
    $errors[] = "Message must be at least 10 characters";
}

// If validation fails
if (!empty($errors)) {
    http_response_code(400);
    echo "Failed: " . implode(", ", $errors);
    exit;
}

// ========== CONFIGURATION ==========
// CHANGE THIS TO YOUR EMAIL ADDRESS
$to = "gaianovatech@gmail.com";

// You can also add CC/BCC
// $cc = "another@email.com";
// $bcc = "manager@email.com";

$subject = "New Contact Form Message - Gaianova Website";

// ========== EMAIL HEADERS ==========
$headers = "From: Gaianova Website <noreply@gaianova.com>\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Add CC/BCC if needed
// $headers .= "Cc: " . $cc . "\r\n";
// $headers .= "Bcc: " . $bcc . "\r\n";

// ========== EMAIL BODY (HTML) ==========
$body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0d5f18; color: #fff; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #0d5f18; display: block; margin-bottom: 5px; }
        .value { background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #eee; }
        .footer { text-align: center; padding: 15px; color: #777; font-size: 12px; }
        .footer a { color: #0d5f18; }