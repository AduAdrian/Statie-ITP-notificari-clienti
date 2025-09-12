// Mock data generator for ITP station pull requests
// This simulates what would be received from the actual ITP station API

export const generateMockPullRequests = () => {
    const plateNumbers = [
        'B123ABC', 'CT456DEF', 'IF789GHI', 'TM012JKL', 'CJ345MNO',
        'IS678PQR', 'SV901STU', 'BV234VWX', 'AR567YZA', 'HD890BCD',
        'MS123EFG', 'NT456HIJ', 'OT789KLM', 'SM012NOP', 'TR345QRS'
    ];

    const clientNames = [
        'Popescu Ion', 'Marinescu Maria', 'Ionescu Alexandru', 'Dumitrescu Ana',
        'Stoica Gheorghe', 'Radu Elena', 'Popa Mihai', 'Dobre Carmen',
        'Stan Florin', 'Marin Ioana', 'Florea Gabriel', 'Gheorghe Cristina',
        'Oprea Daniel', 'Badea Andreea', 'Nistor Radu', 'Tudor Simona',
        'Barbu Cosmin', 'Alexe Diana', 'Mihai Laura', 'Vasile Adrian'
    ];

    const phoneNumbers = [
        '0721234567', '0732456789', '0743567890', '0754678901', '0765789012',
        '0776890123', '0787901234', '0798012345', '0740123456', '0751234567',
        '0762345678', '0773456789', '0784567890', '0795678901', '0730123456'
    ];

    const notes = [
        'Client foarte punctual, preferă notificări dimineața',
        'Vehicul comercial, programare urgentă necesară',
        'Primul ITP pentru acest vehicul',
        'Client solicită notificare cu 48h înainte',
        'Vehicul istoric, necesită atenție specială',
        null, // Some requests might not have notes
        'Client are mai multe vehicule de inspectat',
        'Programare preferată în zilele de lucru',
        null,
        'Solicită confirmare prin SMS înainte de apel'
    ];

    // Generate 5-12 random requests
    const numberOfRequests = Math.floor(Math.random() * 8) + 5;
    const requests = [];

    for (let i = 0; i < numberOfRequests; i++) {
        const requestDate = new Date();
        requestDate.setDate(requestDate.getDate() - Math.floor(Math.random() * 7)); // Last 7 days
        
        const suggestedExpirationDate = new Date();
        suggestedExpirationDate.setFullYear(suggestedExpirationDate.getFullYear() + 1);
        suggestedExpirationDate.setDate(suggestedExpirationDate.getDate() + Math.floor(Math.random() * 30));

        const plateNumber = plateNumbers[Math.floor(Math.random() * plateNumbers.length)];
        const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
        const phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
        const requestNotes = notes[Math.floor(Math.random() * notes.length)];

        requests.push({
            id: `REQ_${Date.now()}_${i}`,
            plateNumber: plateNumber,
            clientName: clientName,
            phoneNumber: phoneNumber,
            requestDate: requestDate.toISOString(),
            suggestedExpirationDate: suggestedExpirationDate.toISOString(),
            suggestedValidity: '1y', // Most common validity period
            status: 'pending_notification',
            source: 'ITP_STATION_SYSTEM',
            notes: requestNotes,
            priority: Math.random() > 0.8 ? 'high' : 'normal',
            vehicleType: Math.random() > 0.7 ? 'commercial' : 'personal'
        });
    }

    // Sort by request date (newest first)
    return requests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
};

// Simulate API delays for more realistic testing
export const simulateApiDelay = () => {
    return new Promise(resolve => {
        setTimeout(resolve, 1500 + Math.random() * 1000); // 1.5-2.5 seconds delay
    });
};

// Mock API error scenarios for testing error handling
export const generateMockError = () => {
    const errors = [
        {
            code: 'CONNECTION_FAILED',
            message: 'Nu s-a putut conecta la stația ITP. Verificați conexiunea la internet.'
        },
        {
            code: 'AUTHENTICATION_FAILED',
            message: 'Autentificare eșuată la sistemul stației ITP. Verificați acreditările.'
        },
        {
            code: 'NO_NEW_REQUESTS',
            message: 'Nu există cereri noi de procesat în sistemul stației ITP.'
        },
        {
            code: 'STATION_MAINTENANCE',
            message: 'Sistemul stației ITP este în mentenanță. Încercați din nou mai târziu.'
        }
    ];

    return errors[Math.floor(Math.random() * errors.length)];
};

// Export for use in components
const mockDataUtils = {
    generateMockPullRequests,
    simulateApiDelay,
    generateMockError
};

export default mockDataUtils;