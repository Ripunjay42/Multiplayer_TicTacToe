// import { useEffect } from "react";
// import { useChatContext } from "stream-chat-react";

// function InviteListener() {
//   const { client } = useChatContext();

//   useEffect(() => {
//     const handleInvite = async (event) => {
//       if (event.type === "game-invite") {
//         console.log("Received game invite event:", event);
//         const accept = window.confirm(`${event.inviter} invited you to a game. Do you accept?`);
        
//         if (accept) {
//           const channel = client.channel("messaging", event.channel_id);
//           await channel.watch();
//         } else {
//           const channel = client.channel("messaging", event.channel_id);
//           await channel.sendMessage({ text: `${client.user.name} declined the invite.` });
//         }
//       }
//     };

//     // Listen to custom events when the client is connected
//     client.on("connection.changed", ({ online }) => {
//       if (online) {
//         client.on("user.custom_event", handleInvite);
//       }
//     });

//     return () => {
//       client.off("user.custom_event", handleInvite);
//     };
//   }, [client]);

//   return null;
// }

// export default InviteListener;
