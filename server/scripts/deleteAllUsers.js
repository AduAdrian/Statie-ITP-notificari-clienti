require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Conectare la MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/notificari', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const deleteAllUsers = async () => {
    try {
        console.log('Conectare la MongoDB...');
        
        // Numără utilizatorii înainte de ștergere
        const countBefore = await User.countDocuments();
        console.log(`Utilizatori găsiți: ${countBefore}`);
        
        if (countBefore === 0) {
            console.log('Nu există utilizatori de șters.');
            process.exit(0);
        }
        
        // Șterge toți utilizatorii
        const result = await User.deleteMany({});
        console.log(`✅ Șters cu succes ${result.deletedCount} utilizatori.`);
        
        // Verifică că au fost șterși
        const countAfter = await User.countDocuments();
        console.log(`Utilizatori rămaşi: ${countAfter}`);
        
        console.log('✅ Operația s-a finalizat cu succes!');
        
    } catch (error) {
        console.error('❌ Eroare la ștergerea utilizatorilor:', error);
    } finally {
        // Închide conexiunea
        await mongoose.connection.close();
        console.log('Conexiune MongoDB închisă.');
        process.exit(0);
    }
};

// Rulează scriptul
deleteAllUsers();
