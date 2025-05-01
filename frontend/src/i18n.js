import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        jobs: "Jobs",
        training: "Training",
        certifications: "Certifications",
        login: "Login",
        register: "Register",
        logout: "Logout",
        profile: "Profile",
        dashboard: "Dashboard"
      },
      auth: {
        login: {
          title: 'Sign in to your account',
          email: 'Email address',
          password: 'Password',
          submit: 'Sign in'
        },
        register: {
          title: 'Create your account',
          name: 'Full Name',
          email: 'Email address',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          role: 'Role',
          submit: 'Register'
        }
      },
      jobs: {
        search: 'Search Jobs',
        filters: 'Filters',
        apply: 'Apply',
        postedBy: 'Posted by',
        postedOn: 'Posted on',
        location: 'Location',
        category: 'Category',
        salary: 'Salary',
        type: 'Job Type'
      },
      training: {
        modules: 'Training Modules',
        enroll: 'Enroll',
        progress: 'Progress',
        complete: 'Complete',
        certificate: 'Certificate'
      },
      welcome: {
        title: "Welcome to Digital Employment Portal",
        description: "Connect with opportunities in India's digital economy",
        findJobs: "Find Jobs",
        getStarted: "Get Started"
      },
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      confirmPassword: "Confirm Password",
      role: "Role",
      worker: "Worker",
      employer: "Employer",
      submit: "Submit",
      features: {
        title: "Why Choose Us",
        description: "We provide comprehensive solutions for digital employment",
        jobs: {
          title: "Job Opportunities",
          description: "Access a wide range of digital job opportunities from trusted employers"
        },
        training: {
          title: "Digital Training",
          description: "Enhance your skills with our comprehensive digital training modules"
        },
        certifications: {
          title: "Skill Certification",
          description: "Get certified for your digital skills and stand out to employers"
        }
      },
      cta: {
        title: "Ready to Get Started?",
        description: "Join thousands of professionals who have found success through our platform",
        button: "Create Your Account"
      }
    }
  },
  hi: {
    translation: {
      nav: {
        jobs: 'नौकरियां',
        training: 'प्रशिक्षण',
        certifications: 'प्रमाणपत्र',
        login: 'लॉग इन',
        register: 'पंजीकरण',
        profile: 'प्रोफ़ाइल',
        dashboard: 'डैशबोर्ड',
        logout: 'लॉग आउट'
      },
      auth: {
        login: {
          title: 'अपने खाते में साइन इन करें',
          email: 'ईमेल पता',
          password: 'पासवर्ड',
          submit: 'साइन इन करें'
        },
        register: {
          title: 'अपना खाता बनाएं',
          name: 'पूरा नाम',
          email: 'ईमेल पता',
          password: 'पासवर्ड',
          confirmPassword: 'पासवर्ड की पुष्टि करें',
          role: 'भूमिका',
          submit: 'पंजीकरण करें'
        }
      },
      jobs: {
        search: 'नौकरियां खोजें',
        filters: 'फ़िल्टर',
        apply: 'आवेदन करें',
        postedBy: 'द्वारा पोस्ट किया गया',
        postedOn: 'पोस्ट की तारीख',
        location: 'स्थान',
        category: 'श्रेणी',
        salary: 'वेतन',
        type: 'नौकरी का प्रकार'
      },
      training: {
        modules: 'प्रशिक्षण मॉड्यूल',
        enroll: 'नामांकन करें',
        progress: 'प्रगति',
        complete: 'पूर्ण करें',
        certificate: 'प्रमाणपत्र'
      },
      welcome: {
        title: "डिजिटल रोजगार पोर्टल में आपका स्वागत है",
        description: "भारत की डिजिटल अर्थव्यवस्था में अवसरों से जुड़ें",
        findJobs: "नौकरियां खोजें",
        getStarted: "शुरू करें"
      }
    }
  },
  bn: {
    translation: {
      nav: {
        jobs: 'চাকরি',
        training: 'প্রশিক্ষণ',
        certifications: 'সার্টিফিকেট',
        login: 'লগ ইন',
        register: 'নিবন্ধন',
        profile: 'প্রোফাইল',
        dashboard: 'ড্যাশবোর্ড',
        logout: 'লগ আউট'
      },
      auth: {
        login: {
          title: 'আপনার অ্যাকাউন্টে সাইন ইন করুন',
          email: 'ইমেইল ঠিকানা',
          password: 'পাসওয়ার্ড',
          submit: 'সাইন ইন করুন'
        },
        register: {
          title: 'আপনার অ্যাকাউন্ট তৈরি করুন',
          name: 'পূর্ণ নাম',
          email: 'ইমেইল ঠিকানা',
          password: 'পাসওয়ার্ড',
          confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
          role: 'ভূমিকা',
          submit: 'নিবন্ধন করুন'
        }
      },
      jobs: {
        search: 'চাকরি খুঁজুন',
        filters: 'ফিল্টার',
        apply: 'আবেদন করুন',
        postedBy: 'পোস্ট করেছেন',
        postedOn: 'পোস্টের তারিখ',
        location: 'অবস্থান',
        category: 'বিভাগ',
        salary: 'বেতন',
        type: 'চাকরির ধরন'
      },
      training: {
        modules: 'প্রশিক্ষণ মডিউল',
        enroll: 'নিবন্ধন করুন',
        progress: 'অগ্রগতি',
        complete: 'সম্পূর্ণ করুন',
        certificate: 'সার্টিফিকেট'
      },
      welcome: {
        title: "ডিজিটাল কর্মসংস্থান পোর্টালে আপনাকে স্বাগতম",
        description: "ভারতের ডিজিটাল অর্থনীতিতে সুযোগের সাথে যুক্ত হোন",
        findJobs: "চাকরি খুঁজুন",
        getStarted: "শুরু করুন"
      }
    }
  },
  ta: {
    translation: {
      nav: {
        jobs: 'வேலைகள்',
        training: 'பயிற்சி',
        certifications: 'சான்றிதழ்கள்',
        login: 'உள்நுழைய',
        register: 'பதிவு',
        profile: 'சுயவிவரம்',
        dashboard: 'டாஷ்போர்டு',
        logout: 'வெளியேற'
      },
      auth: {
        login: {
          title: 'உங்கள் கணக்கில் உள்நுழைக',
          email: 'மின்னஞ்சல் முகவரி',
          password: 'கடவுச்சொல்',
          submit: 'உள்நுழைக'
        },
        register: {
          title: 'உங்கள் கணக்கை உருவாக்க',
          name: 'முழு பெயர்',
          email: 'மின்னஞ்சல் முகவரி',
          password: 'கடவுச்சொல்',
          confirmPassword: 'கடவுச்சொலை உறுதிப்படுத்த',
          role: 'பாத்திரம்',
          submit: 'பதிவு'
        }
      },
      jobs: {
        search: 'வேலைகளை தேட',
        filters: 'வடிகட்டிகள்',
        apply: 'விண்ணப்பிக்க',
        postedBy: 'பதிவு செய்தவர்',
        postedOn: 'பதிவு செய்யப்பட்ட தேதி',
        location: 'இருப்பிடம்',
        category: 'வகை',
        salary: 'சம்பளம்',
        type: 'வேலை வகை'
      },
      training: {
        modules: 'பயிற்சி தொகுதிகள்',
        enroll: 'பதிவு',
        progress: 'முன்னேற்றம்',
        complete: 'முடிக்க',
        certificate: 'சான்றிதழ்'
      },
      welcome: {
        title: "டிஜிட்டல் வேலைவாய்ப்பு போர்டலுக்கு வரவேற்கிறோம்",
        description: "இந்தியாவின் டிஜிட்டல் பொருளாதாரத்தில் வாய்ப்புகளுடன் இணைந்து கொள்ளுங்கள்",
        findJobs: "வேலைகளை தேட",
        getStarted: "தொடங்க"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 