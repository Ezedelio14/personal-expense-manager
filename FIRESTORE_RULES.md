# Firestore Security Rules

Para corrigir o erro de permissões, você precisa atualizar as regras de segurança no Firebase Console.

## Passos:

1. Vá para Firebase Console: https://console.firebase.google.com/
2. Selecione o projeto "personal-expense-manager-c4cf2"
3. Vá para Firestore Database > Rules
4. Copie e cole as seguintes regras:

\`\`\`

```firestore file="firestore.rules"
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /budgets/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
