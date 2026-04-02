function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    
    if (input.value.trim() !== "") {
        const msg = document.createElement('div');
        msg.textContent = input.value;
        msg.style.background = "#34c759";
        msg.style.color = "white";
        msg.style.padding = "10px 15px";
        msg.style.borderRadius = "15px";
        msg.style.alignSelf = "flex-end";
        msg.style.maxWidth = "80%";
        
        chatBox.appendChild(msg);
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
