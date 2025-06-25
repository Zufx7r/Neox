<?php
$submitted = false;
$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $message = trim($_POST["message"] ?? '');
  $name = htmlspecialchars($_POST["name"] ?? '');
  $email = htmlspecialchars($_POST["email"] ?? '');

  if (!$name || !$email || !$message) {
    $error = "All fields are required.";
  } else {
    $to = "shoaibmamozai4@gmail.com@email.com"; // 🔁 Replace with your email
    $subject = "New Message from $name";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
      $submitted = true;
    } else {
      $error = "Message could not be sent.";
    }
  }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neox | About Me</title>
  <link rel="icon" type="image/png" href="NeoxRounded.png" />
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body {
      background: #0f0f0f;
      color: white;
      overflow-x: hidden;
      font-family: 'Segoe UI', sans-serif;
    }
    .bg-animation {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
      background: repeating-radial-gradient(circle at center, rgba(0, 255, 204, 0.05) 1px, transparent 10px);
      animation: floatBg 30s linear infinite;
    }
    @keyframes floatBg {
      from { background-position: 0 0; }
      to { background-position: 1000px 1000px; }
    }
  </style>
</head>
<body>
<div class="bg-animation"></div>

<header class="relative z-10 text-center py-10 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg rounded-b-2xl">
  <h1 class="text-5xl font-bold text-teal-400 drop-shadow">Neox</h1>
  <p class="mt-3 text-gray-400 text-lg">Welcome to my world!</p>
  <a href="/dashboard" class="inline-block mt-5 px-6 py-3 bg-teal-500 text-black font-semibold rounded-xl shadow hover:bg-teal-400 transition">Dashboard</a>
</header>

<main class="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-16">
  <section class="bg-gray-900 p-6 rounded-2xl shadow-md">
    <h2 class="text-3xl text-teal-400 font-semibold mb-4">About Me</h2>
    <p class="text-gray-300 text-lg leading-relaxed">Hi, I'm Shoaib, a passionate creator with a strong love for gaming, creative coding, and exploring new ideas. I'm always building, experimenting, and bringing unique concepts to life.</p>
  </section>

  <section class="bg-gray-900 p-6 rounded-2xl shadow-md">
    <h2 class="text-3xl text-teal-400 font-semibold mb-4">Hobbies</h2>
    <ul class="list-disc list-inside text-gray-300 space-y-1">
      <li>Game development</li>
      <li>Programming in Lua & Python</li>
      <li>Making websites and tools</li>
    </ul>
  </section>

  <section class="bg-gray-900 p-6 rounded-2xl shadow-md">
    <h2 class="text-3xl text-teal-400 font-semibold mb-4">Skills</h2>
    <ul class="list-disc list-inside text-gray-300 space-y-1">
      <li>Lua (advanced-tier)</li>
      <li>Castle visual scripting</li>
      <li>Python programming</li>
      <li>HTML, CSS, JavaScript</li>
    </ul>
  </section>

  <section class="bg-gray-900 p-6 rounded-2xl shadow-md">
    <h2 class="text-3xl text-teal-400 font-semibold mb-4">Projects</h2>
    <p class="text-gray-300 mb-4">I build fun and interactive projects. Check one out below:</p>
    <div class="flex flex-wrap gap-4">
      <a href="https://s.castle.xyz/eiZ5mjaIyTXj" target="_blank" class="px-5 py-3 bg-teal-500 text-black font-medium rounded-xl hover:bg-teal-400 transition">My Castle Profile</a>
      <a href="Chatboom_1.0.apk" download class="px-5 py-3 bg-teal-500 text-black font-medium rounded-xl hover:bg-teal-400 transition">Download ChatBoom</a>
    </div>
  </section>

  <section class="bg-gray-900 p-6 rounded-2xl shadow-md">
    <h2 class="text-3xl text-teal-400 font-semibold mb-4">Games</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <a href="tic-tac-toe" class="block text-center p-4 bg-gray-800 rounded-xl shadow hover:bg-gray-700 transition">Play Tic-Tac-Toe</a>
      <a href="memory-match" class="block text-center p-4 bg-gray-800 rounded-xl shadow hover:bg-gray-700 transition">Play Memory Match</a>
      <a href="color-clicker" class="block text-center p-4 bg-gray-800 rounded-xl shadow hover:bg-gray-700 transition">Play Colors Clicker</a>
      <a href="live-chat" class="block text-center p-4 bg-gray-800 rounded-xl shadow hover:bg-gray-700 transition">Play Live Chat</a>
    </div>
  </section>

  <section class="bg-gray-900 p-6 rounded-2xl shadow-md">
    <h2 class="text-3xl text-teal-400 font-semibold mb-4 text-center">Contact Me</h2>
    <p class="text-center text-gray-400 mb-6">Reach out via Discord, GitHub, or your favorite dev community!</p>

    <?php if ($submitted): ?>
      <p class="text-green-400 text-center font-semibold">✅ Your message was sent successfully!</p>
    <?php elseif ($error): ?>
      <p class="text-red-400 text-center font-semibold">❌ <?= $error ?></p>
    <?php endif; ?>

    <form method="POST" class="space-y-4 max-w-xl mx-auto">
      <input name="name" placeholder="Your Name" required class="w-full rounded-lg p-3 bg-gray-800 text-white border border-gray-600" />
      <input name="email" type="email" placeholder="Your Email" required class="w-full rounded-lg p-3 bg-gray-800 text-white border border-gray-600" />
      <textarea name="message" placeholder="Your Message" required class="w-full rounded-lg p-3 bg-gray-800 text-white border border-gray-600" rows="6"></textarea>
      <div class="text-center">
        <button type="submit" class="px-6 py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition">Send Message</button>
      </div>
    </form>
  </section>
</main>

<footer class="relative z-10 text-center py-6 border-t border-gray-700 mt-12 text-gray-500">
  Made by Neox | 2025 | <a href="/privacy.html" class="text-sky-400 hover:underline">Privacy Policy</a>
</footer>

</body>
</html>