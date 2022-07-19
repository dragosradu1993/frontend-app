

const STRINGS = {
    error: {
        atLogin: "Ceva nu a mers bine! Te rugăm încearcă mai târziu!",
        samePassword: "Parola introdusă a mai fost utilizată. Te rog seteaza-ți o nouă parolă!",
        invalidPassword: "Parola trebuie să conțină minim 8 caractere împreuna cu următorul set de caractere: literă mare, literă mica, caracter special",
        missmatchPassword: "Cele două parole nu corespund! Te rog reintroduce parolele!",
        email: 'Adresa de email este invalidă!',
        
        projects: {
            name: 'Numele temei propuse trebuie să aibă minim 3 caractere. Te rog introduce numele complet a temei de proiect',
            description: 'Descrierea trebuie să aibă minim 3 caractere. Te rog oferă o descriere a temei pe care o propui',
            success: 'Solicitarea ta a fost trimisă cu succes. Te rog urmăreste în secțiunea Cererile mele, starea solicitărilor trimise de tine',
            noData: 'Te rog completează câmpurile'
        },

        promotions: {
            success: 'Promoția a fost adăugată cu succes!',
            invalidPromotion: `Promoția setată este invalidă! Sunt acceptate doar numere. (Ex: '${new Date().getFullYear()}'`,
            invalidDateLimitRegex: `Data limită nu este în formatul YYYY-MM-DD`,
            invalidDateLimit: `Anul setat pentru data limită nu poate fi mai mic sau mai mare decât anul setat ca promoție + 1`,
            invalidData: 'Te rog completează câmpurile!'
        },

        secretaries: {
            addStudents: {
                noData: 'Te rog introduce toate datele',
                nameLength: 'Numele de familie sau prenumele trebuie să aibă minim 3 caractere!',
                identityId: 'CNP-ul este invalid!',
            }, 
            addData: {
                notAdd: 'Nu toate informațiile au fost salvate. Te rog reverifică datele introduse!',
                successAll: 'Toate informațiile au fost salvate cu success!'
            },
            addTeachers: {
                noData: 'Te rog introduce toate datele',
                nameLength: 'Numele de familie sau prenumele trebuie să aibă minim 3 caractere!',
                bachelorsTrue: 'Ai setat că poate coordona lucrări de licență însă are 0 locuri disponibile. Te rog reverifică datele!',
                bachelorsFalse: 'Ai setat că nu poate coordona lucrări de licență însă are locuri disponibile. Te rog reverifică datele!',
                disertationTrue: 'Ai setat că poate coordona lucrări de disertație însă are 0 locuri disponibile. Te rog reverifică datele!',
                disertationFalse: 'Ai setat că nu poate coordona lucrări de disertație însă are locuri disponibile. Te rog reverifică datele!',
                noNumber: 'Sunt acceptate doar numere pentru locurile disponibile',
                departmentLength: 'Departamentul trebuie să aibă minim 3 caractere!'
            }
        },

        admin: {
            addFaculties: {
                noData: 'Te rog introduce toate datele',
                nameInvalid: 'Numele facultății are prea puține caractere. Te rog reverifică datele',
                addressInvalid: 'Adresa facultății este invalidă. Te rog reverifică datele',
                phoneNumber: 'Numărul de telefon este invalid. Te rog reverifică datele',
                shortNameInvalid: 'Codul facultății este invalid'
            }
        }
    },
    user: {
        changePassword: "Parola a fost schimbată cu succes!",
    },
    app: {
        dashboard: {
            students: {
                facultyInput: 'Facultatea',
                announce: 'Anunțuri',
                dateLimitTitle: 'Data limită pentru alegerea temei de proiect',
                myProject: 'Proiectul meu',
                dateLimitSubtitleMoreThan: 'Data limită pentru alegerea temei este ',
                dateLimitSubtitleLessThan: 'Nu uita, data limită pentru alegerea temei este ',
                dateLimitSubtitleNoTime: 'Timpul limită a expirat sau promoția aleasă nu este cea curentă',
                dateLimitSubtitleSecond: 'Zile rămase',
                noTeacher: 'Din păcate nu există profesori disponibili pentru această promoție'
            },
            teachers: {
                bachelors: 'Licență',
                disertations: 'Disertație',
                slots: 'Locuri disponibile',
                projectsDashboardTitle: 'Setare coordonare proiecte',
                requestsBachelorsTitle: 'Cereri licență',
                requestsBachelorSubtitle: `Pentru licență, azi ${new Date().toLocaleDateString('ro-RO')} există următoarele informații:`,
                requestsDisertationsTitle: 'Cereri disertație',
                requestsDisertationSubtitle: `Pentru disertație, azi ${new Date().toLocaleDateString('ro-RO')} există următoarele informații:`,
                availableSlots: 'Număr locuri',
                save: 'Salvează',
                dateLimitRequests: 'Dată limită cereri',
                dateLimitSlots: 'Dată limită setare locuri',
                myProject: 'Proiectul meu',
                dateLimitRequestsMoreThan: 'Data limită pentru acceptarea cererilor este ',
                dateLimitRequestsLessThan: 'Nu uita, data limită pentru acceptarea cererilor este ',
                dateLimitRequestsNoTime: 'Timpul limită a expirat sau promoția aleasă nu este cea curentă',
                dateLimitSlotsMoreThan: 'Data limită pentru setarea locurilor disponibile este ',
                dateLimitSlotsLessThan: 'Nu uita, data limită pentru setarea locurilor disponibile este ',
                dateLimitSlotsNoTime: 'Timpul limită a expirat sau promoția aleasă nu este cea curentă',
                dateLimitSubtitleSecond: 'Zile rămase',
                noStudents: 'Din păcate nu ai studenți pentru această promoție'
                
            },

            project: {
                pending: 'În așteptare',
                rejected: 'Respinse',
                approved: 'Aprobate'
            }
        }
    },
    buttons: {
        ok: 'OK',
        cancel: 'Anulează'
    }
}

export default STRINGS