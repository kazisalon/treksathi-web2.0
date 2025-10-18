# TrekSathi - नेपाली यात्रा वेब एप्लिकेशन

एक आधुनिक र सुन्दर नेपाली यात्रा वेब एप्लिकेशन जसमा होटल बुकिङ, उडान बुकिङ, टुर प्याकेजहरू, र लाइभ लोकेशन सुविधाहरू छन्।

## विशेषताहरू

- 🏔️ **गन्तव्य अन्वेषण** - नेपालका सुन्दर ठाउँहरू खोज्नुहोस्
- 🏨 **होटल बुकिङ** - सजिलै होटल बुक गर्नुहोस्
- ✈️ **उडान बुकिङ** - उडानको टिकट बुक गर्नुहोस्
- 🎒 **टुर प्याकेजहरू** - तयार टुर प्याकेजहरू छान्नुहोस्
- 📍 **लाइभ लोकेशन** - वास्तविक समयमा स्थान ट्र्याकिङ
- 👤 **प्रयोगकर्ता खाता** - लग इन/साइन अप सुविधा
- 📱 **मोबाइल फ्रेन्डली** - सबै डिभाइसमा काम गर्छ
- 🌐 **नेपाली भाषा समर्थन** - पूर्ण नेपाली भाषामा

## प्रविधिक स्ट्याक

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Prisma + SQLite
- **Authentication**: NextAuth.js
- **Maps**: React Leaflet
- **Forms**: React Hook Form
- **State Management**: Zustand
- **API**: REST APIs

## सेटअप निर्देशनहरू

### 1. Dependencies Install गर्नुहोस्

```bash
npm install
```

### 2. Environment Variables सेट गर्नुहोस्

`.env.local` फाइल बनाउनुहोस्:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. Database Setup गर्नुहोस्

```bash
npx prisma generate
npx prisma db push
```

### 4. Development Server चलाउनुहोस्

```bash
npm run dev
```

अब [http://localhost:3000](http://localhost:3000) मा जानुहोस्।

## प्रोजेक्ट संरचना
