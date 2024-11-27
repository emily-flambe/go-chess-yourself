document.getElementById('messageForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const message = document.getElementById('message').value;
    const responseElement = document.getElementById('response');
  
    try {
      const response = await fetch('/print_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
  
      const result = await response.json();
      responseElement.textContent = result.message;
    } catch (error) {
      responseElement.textContent = 'Error: Could not send message';
    }
  });
  