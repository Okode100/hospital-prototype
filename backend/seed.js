const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Patient = require('./models/Patient');
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');


dotenv.config();

const patients = [
  {
    serialNumber: 'uwra00001',
    fullName: 'Amina Yusuf',
    dateOfBirth: '1985-04-12',
    gender: 'Female',
    bloodGroup: 'O+',
    registrationDate: '2024-01-05',
    phone: '+234 803 123 4567',
    email: 'amina.yusuf@example.com',
    address: '12 Unity Crescent, Abuja, Nigeria',
    emergencyContacts: [
      { name: 'Khalid Yusuf', relation: 'Spouse', phone: '+234 803 765 4321' },
    ],
    emergencyPhysician: {
      name: 'Dr. Samuel Okoro',
      phone: '+234 809 111 2222',
      email: 'samuel.okoro@cityhospital.com',
    },
    medicalHistory: {
      generalHistory: [],
      maternalReproductiveHistory: [],
      allergies: [],
      surgicalHistory: [],
      medications: [],
    },
    screeningHistory: [],
  },
  {
    serialNumber: 'uwra00002',
    fullName: 'Chinedu Obasi',
    dateOfBirth: '1978-09-23',
    gender: 'Male',
    bloodGroup: 'A-',
    registrationDate: '2024-02-14',
    phone: '+234 702 987 6543',
    email: 'chinedu.obasi@example.com',
    address: '45 Admiralty Way, Lekki, Lagos',
    emergencyContacts: [
      { name: 'Ifeoma Obasi', relation: 'Sister', phone: '+234 701 234 5678' },
    ],
    emergencyPhysician: {
      name: 'Dr. Helen Bassey',
      phone: '+234 806 333 4444',
      email: 'helen.bassey@metroclinic.com',
    },
    medicalHistory: {
      generalHistory: [],
      maternalReproductiveHistory: [],
      allergies: [],
      surgicalHistory: [],
      medications: [],
    },
    screeningHistory: [],
  },
  {
    serialNumber: 'uwra00003',
    fullName: 'Fatima Bello',
    dateOfBirth: '1992-12-05',
    gender: 'Female',
    bloodGroup: 'B+',
    registrationDate: '2024-03-02',
    phone: '+234 704 555 8899',
    email: 'fatima.bello@example.com',
    address: '8 Emerald Estate, Kaduna, Nigeria',
    emergencyContacts: [
      { name: 'Bello Musa', relation: 'Father', phone: '+234 803 222 3333' },
    ],
    emergencyPhysician: {
      name: 'Dr. Grace Eweka',
      phone: '+234 802 777 8888',
      email: 'grace.eweka@federalhospital.com',
    },
    medicalHistory: {
      generalHistory: [],
      maternalReproductiveHistory: [],
      allergies: [],
      surgicalHistory: [],
      medications: [],
    },
    screeningHistory: [],
  },
  {
    serialNumber: 'uwra00004',
    fullName: 'Michael Adewale',
    dateOfBirth: '1988-07-19',
    gender: 'Male',
    bloodGroup: 'AB+',
    registrationDate: '2024-03-18',
    phone: '+234 809 444 5566',
    email: 'michael.adewale@example.com',
    address: '27 Broad Street, Marina, Lagos',
    emergencyContacts: [
      { name: 'Kemi Adewale', relation: 'Wife', phone: '+234 705 444 8899' },
    ],
    emergencyPhysician: {
      name: 'Dr. Victor Onyeneke',
      phone: '+234 708 111 9999',
      email: 'victor.onyeneke@lagoshospital.com',
    },
    medicalHistory: {
      generalHistory: [],
      maternalReproductiveHistory: [],
      allergies: [],
      surgicalHistory: [],
      medications: [],
    },
    screeningHistory: [],
  },
  {
    serialNumber: 'uwra00005',
    fullName: 'Ngozi Eze',
    dateOfBirth: '1975-02-28',
    gender: 'Female',
    bloodGroup: 'O-',
    registrationDate: '2024-04-10',
    phone: '+234 701 888 4455',
    email: 'ngozi.eze@example.com',
    address: '33 Independence Layout, Enugu, Nigeria',
    emergencyContacts: [
      { name: 'Obinna Eze', relation: 'Brother', phone: '+234 803 999 1122' },
    ],
    emergencyPhysician: {
      name: 'Dr. Adaobi Nwosu',
      phone: '+234 704 666 7777',
      email: 'adaobi.nwosu@regionalclinic.com',
    },
    medicalHistory: {
      generalHistory: [],
      maternalReproductiveHistory: [],
      allergies: [],
      surgicalHistory: [],
      medications: [],
    },
    screeningHistory: [],
  },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined in your environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // ADMIN SEEDING LOGIC
    const adminUsername = 'admin';
    const adminRawPassword = 'adminpass';
    const adminExisting = await Admin.findOne({ username: adminUsername });
    if (!adminExisting) {
      const hashed = await bcrypt.hash(adminRawPassword, 10);
      await Admin.create({ username: adminUsername, password: hashed, role: 'admin' });
      console.log(`✨ Admin user created. Username: '${adminUsername}' Password: '${adminRawPassword}'`);
    } else {
      console.log(`ℹ️  Admin user '${adminUsername}' already exists.`);
    }
    // END ADMIN SEEDING

    let insertedCount = 0;
    for (const patient of patients) {
      const existing = await Patient.findOne({ serialNumber: patient.serialNumber });
      if (existing) {
        console.log(`ℹ️  Patient ${patient.serialNumber} already exists. Skipping...`);
        continue;
      }

      await Patient.create(patient);
      insertedCount += 1;
      console.log(`✅ Inserted patient ${patient.serialNumber} (${patient.fullName})`);
    }

    console.log(`\n✨ Seed complete. ${insertedCount} new patient(s) inserted.`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();

