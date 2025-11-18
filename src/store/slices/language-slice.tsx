import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SignInPageInterface {
  lables: {
    userName: string;
    password: string;
  };
  btn: string;
  sentence: string;
}

interface LandingPageInterface {
  title: [string, string, string];
  body: string;
  btns: {
    learnMore: string;
    contactUs: string;
  };
}

interface SideBarInterface {
  home: string;
  users: string;
  roles: string;
  complaints: string;
}

interface ClientsComplaintsPageInterface {
  title: string;
  btn: string;
  table: [string, string, string, string, string, string];
  popup: {
    title: string;
    inputs: {
      name: string;
      phone: string;
      title: string;
      details: string;
      screenViewer: string;
      serverViewer: string;
      viewerId: string;
      password: string;
      priority_status: string;
      priority_statuses: [string, string, string];
      intervention: string;
      img: [string, string];
      btn: string;
    };
  };
}

interface ManagersUsersPageInterface {
  title: string;
  btn: string;
  uploadExcelFileBtn: string;
  table: [string, string, string, string, string, string, string];
  popup: {
    title: {
      create: string;
      update: string;
    };
    inputs: {
      userName: string;
      email: string;
      phone: string;
      password: string;
      role: string;
      btn: string;
    };
  };
}

interface ManagersRolesPageInterface {
  title: string;
  btn: string;
  table: [string, string, string, string];
  popup: {
    title: {
      create: string;
      update: string;
    };
    inputs: {
      name: string;
      code: string;
      allRoles: string;
    };
  };
}

interface ManagersComplaintsPageInterface {
  title: string;
  btn: string;
  reportBtn: string;
  table: [string, string, string, string, string, string, string, string, string];
  popup: {
    title: {
      create: string;
      read: string;
    };
    inputs: {
      table: [string, string, string];
      name: string;
      phone: string;
      title: string;
      details: string;
      screenViewer: string;
      serverViewer: string;
      viewerId: string;
      intervention: string;
      password: string;
      img: [string, string];
      btn: string;
    };
  };
  assignPopup: {
    title: string;
    referTitle: string;
    noteFSupporter: string;
    maxTime: string;
    table: [string, string, string];
    btn: string;
    referBtn: string;
  };
  reportPopup: {
    title: string;
    fromDate: string;
    toDate: string;
    status: string;
    sorted_by: string;
    user: string;
    btn: string;
  };
}

interface HeaderInterface {
  sentence: [string, string, string];
  dropDownMenu: {
    profile: string;
    signOut: string;
  };
}
interface ProfileInterface {
  title: string;
  user_name: string;
  passwordForm: {
    oldPass: string;
    newPass: string;
    confirmNewPass: string;
    btn: string;
  };
}
interface SearchInterface {
  placeholder: string;
  selectCol: string;
}
// interface PotentialCustomerPageInterface {
//   title: string;
// }

interface pages {
  signInPage: SignInPageInterface;
  landingPage: LandingPageInterface;
  sideBar: SideBarInterface;
  clientsComplaintsPage: ClientsComplaintsPageInterface;
  managersUsersPage: ManagersUsersPageInterface;
  managersRolesPage: ManagersRolesPageInterface;
  managersComplaintsPage: ManagersComplaintsPageInterface;
  header: HeaderInterface;
  analytics: {
    clientAnalytics: [string, string, string, string];
    supporterAnalytics: [string, string, string, string];
    managerAnalytics: [string, string, string, string];
    vsLast: string;
  };
  profile: ProfileInterface;
  search: SearchInterface;
}

interface LangState {
  lang: "ar" | "en";
  ar: pages;
  en: pages;
}

const initialState: LangState = {
  lang: "en",
  en: {
    signInPage: {
      lables: {
        userName: "User Name",
        password: "Password",
      },
      btn: "Sign In",
      sentence: "Continuous support... and communication without limits.",
    },
    landingPage: {
      title: ["LET'S START", "SOMTHING", "BIG TOGETHER"],
      body: "At PowerSoft, we pride ourselves on our extensive experience in developing advanced software solutions that contribute to improving business performance and increasing efficiency. We are committed to providing high-quality technologies and ongoing support to our customers across various industries.",
      btns: {
        learnMore: "LEARN MORE",
        contactUs: "CONTACT US",
      },
    },
    sideBar: {
      home: "Home",
      users: "Users",
      roles: "Roles",
      complaints: "Complaints",
    },
    clientsComplaintsPage: {
      title: "All Complaints",
      btn: "Create Complaint",
      table: [
        "complainant",
        "complainant Phone",
        "Complaint Subject",
        "Complaint Details",
        "Status",
        "Created At",
      ],
      popup: {
        title: "Create New Complaint",
        inputs: {
          name: "Complainant",
          phone: "Complainant Phone",
          title: "Complaint Subject",
          details: "Complaint Details",
          screenViewer: "Screen Sharer",
          serverViewer: "Server Sharer (main device)",
          viewerId: "Sharer ID",
          password: "Password",
          priority_status: "Priority Status",
          priority_statuses: ["High", "Normal", "Low"],
          intervention: "Time for intervention (if needed)",
          img: ["Click to upload", "or drag and drop"],
          btn: "Confirm Complaint",
        },
      },
    },
    managersUsersPage: {
      title: "All Users",
      btn: "New User",
      uploadExcelFileBtn: "Upload Excel File",
      table: ["User", "Phone", "Email", "Role", "Complaints Count", "Solving Count", "Created At"],
      popup: {
        title: {
          create: "Create New User",
          update: "Update User",
        },
        inputs: {
          userName: "User Name",
          email: "Email Address *",
          phone: "Phone *",
          password: "Password",
          role: "Role",
          btn: "Confirm",
        },
      },
    },
    managersRolesPage: {
      title: "All Roles",
      btn: "New Role",
      table: ["Code", "Name", "Users Count", "Created At"],
      popup: {
        title: {
          create: "Create New Role",
          update: "Update Role",
        },
        inputs: {
          name: "Role Name",
          code: "Code",
          allRoles: "Pick Roles",
        },
      },
    },
    managersComplaintsPage: {
      title: "All Complaints",
      btn: "Create Complaint",
      reportBtn: "Create Report",
      table: [
        "Company",
        "complainant",
        "complainant Phone",
        "Complaint Subject",
        "Complaint Details",
        "Status",
        "Priority Status",
        "Working At",
        "Created At",
      ],
      popup: {
        title: {
          create: "Create Complaint For Client",
          read: "Client Complaint",
        },
        inputs: {
          table: ["User", "Email Address", "Phone"],
          name: "Complainant",
          phone: "Complainant Phone",
          title: "Complaint Subject",
          details: "Complaint Details",
          screenViewer: "Screen Sharer",
          serverViewer: "Server Sharer (main device)",
          viewerId: "Sharer ID",
          password: "Password",
          intervention: "Time for intervention (if needed)",
          img: ["Click to upload", "or drag and drop"],
          btn: "Confirm Complaint",
        },
      },
      assignPopup: {
        title: "Assign Supporter",
        referTitle: "Refere To Another Supporter",
        noteFSupporter: "Note For Supporter",
        maxTime: "Max Time To Finish",
        table: ["User", "Email", "Created At"],
        btn: "Assign",
        referBtn: "Refere",
      },
      reportPopup: {
        title: "Create Company Complaints Report",
        fromDate: "From",
        toDate: "To",
        status: "Status",
        sorted_by: "Ordered",
        user: "Company",
        btn: "Create",
      },
    },
    header: {
      sentence: ["Welcome Back,", "Here are latest updates on your", "Dashboard"],
      dropDownMenu: {
        signOut: "Sign Out",
        profile: "Profile",
      },
    },
    analytics: {
      clientAnalytics: [
        "Total Complaints",
        "Done Complaints",
        "Pending Complaints",
        "In Progress Complaints",
      ],
      managerAnalytics: [
        "Total Complaints",
        "Done Complaints",
        "Opened Complaints",
        "High Priority Status",
      ],
      supporterAnalytics: [
        "Total Complaints",
        "Done Complaints",
        "Opened Complaints",
        "High Priority Status",
      ],
      vsLast: "vs last month",
    },
    profile: {
      title: "Your Profile",
      user_name: "User",
      passwordForm: {
        oldPass: "Current Password",
        newPass: "New Password",
        confirmNewPass: "Confirm New Password",
        btn: "Confirm",
      },
    },
    search: {
      placeholder: "Search...",
      selectCol: "Select Column",
    },
  },
  ar: {
    signInPage: {
      lables: {
        userName: "اسم المستخدم",
        password: "كلمة السر",
      },
      btn: "تسجيل الدخول",
      sentence: "دعمٌ دائم... وتواصلٌ بلا حدود.",
    },
    landingPage: {
      title: ["لنبدأ", "شئ ما", "كبير معا"],
      body: "في باورسوفت، نفخر بخبرتنا الواسعة في تطوير حلول برمجية متقدمة تُسهم في تحسين أداء الأعمال وزيادة الكفاءة. ونلتزم بتوفير تقنيات عالية الجودة ودعم مستمر لعملائنا في مختلف القطاعات.",
      btns: {
        learnMore: "اعرف اكثر",
        contactUs: "تواصل معنا",
      },
    },
    sideBar: {
      home: "الرئيسية",
      users: "المستخدمين",
      roles: "الصلاحيات",
      complaints: "الشكاوي",
    },
    clientsComplaintsPage: {
      title: "كل الشكاوي",
      btn: "انشاء شكوي",
      table: ["مقدم الشكوي", "هاتف", "العنوان", "التفاصيل", "الحالة", "تاريخ الانشاء"],
      popup: {
        title: "انشاء شكوي جديدة",
        inputs: {
          name: "مقدم الشكوي",
          phone: "رقم هاتف مقدم الشكوي",
          title: "موضوع الشكوي",
          details: "تفاصيل الشكوي",
          screenViewer: "مشارك الشاشة",
          serverViewer: "مشارك شاشة السيرفر (الجهاز الرئيسي)",
          viewerId: "معرف المشارك",
          password: "كلمة السر",
          priority_status: "حالة الأولولية",
          priority_statuses: ["عالية", "عادية", "منخفضة"],
          intervention: "موعد المداخلة (اذا احتجنا)",
          img: ["اضغط للرفع", "او اسحب و افلت"],
          btn: "تأكيد الشكوي",
        },
      },
    },
    managersUsersPage: {
      title: "كل المستخدمين",
      btn: "مستخدم جديد",
      uploadExcelFileBtn: "رفع ملف Excel",
      table: [
        "المستخدم",
        "الهاتف",
        "البريد الالكتروني",
        "الصلاحية",
        "عدد الشكاوي",
        "عدد الحلول",
        "تاريخ الانشاء",
      ],
      popup: {
        title: {
          create: "انشاء مستخدم جديد",
          update: "تعديل بيانات مستخدم",
        },
        inputs: {
          userName: "اسم المستخدم",
          email: "* البريد الالكتروني",
          phone: "* الهاتف",
          password: "كلمة المرور",
          role: "الصلاحية",
          btn: "تأكيد",
        },
      },
    },
    managersRolesPage: {
      title: "كل الصلاحيات",
      btn: "انشاء صلاحية",
      table: ["الكود", "الاسم", "عدد المستخدمين", "تاريخ الانشاء"],
      popup: {
        title: {
          create: "انشاء صلاحية جديدة",
          update: "تعديل الصلاحية",
        },
        inputs: {
          name: "اسم الصلاحية",
          code: "الكود",
          allRoles: "اختر الصلاحيات",
        },
      },
    },
    managersComplaintsPage: {
      title: "كل الشكاوي",
      btn: "انشاء شكوي",
      reportBtn: "انشاء تقرير",
      table: [
        "الشركة",
        "مقدم الشكوي",
        "هاتف",
        "موضوع الشكوي",
        "تفاصيل الشكوي",
        "الحالة",
        "حالة الاولوية",
        "تاريخ العمل",
        "تاريخ الانشاء",
      ],
      popup: {
        title: {
          create: "انشاء شكوي لعميل",
          read: "شكوة عميل",
        },
        inputs: {
          table: ["المستخدم", "البريد الالكتروني", "الهاتف"],
          name: "مقدم الشكوي",
          phone: "رقم هاتف مقدم الشكوي",
          title: "موضوع الشكوي",
          details: "تفاصيل الشكوي",
          screenViewer: "مشارك الشاشة",
          serverViewer: "مشارك شاشة السيرفر (الجهاز الرئيسي)",
          viewerId: "معرف المشارك",
          password: "كلمة السر",
          intervention: "موعد المداخلة (اذا احتجنا)",
          img: ["اضغط للرفع", "او اسحب و افلت"],
          btn: "تأكيد الشكوي",
        },
      },
      assignPopup: {
        title: "تكليف الدعم",
        referTitle: "توجيه المشكلة لداعم اخر",
        noteFSupporter: "رسالة للدعم",
        maxTime: "الحد الاقصي من الوقت للحل",
        table: ["المستخدم", "البريد الالكتروني", "تاريخ الانشاء"],
        btn: "تكليف",
        referBtn: "توجيه",
      },
      reportPopup: {
        title: "انشاء تقرير شكاوى لشركة",
        fromDate: "من",
        toDate: "الي",
        status: "الحالة",
        sorted_by: "ترتيب",
        user: "الشركة",
        btn: "انشاء",
      },
    },
    header: {
      sentence: ["اهلا بعودتك,", "فيما يلي آخر التحديثات على", "لوحة تحكمك"],
      dropDownMenu: {
        signOut: "تسجيل خروج",
        profile: "الملف الشخصي",
      },
    },
    analytics: {
      clientAnalytics: [
        "إجمالي الشكاوى",
        "الشكاوى المنجزة",
        "الشكاوى المعلقة",
        "الشكاوى قيد التنفيذ",
      ],
      managerAnalytics: [
        "إجمالي الشكاوى",
        "الشكاوى المنجزة",
        "الشكاوى المفتوحة",
        "الشكاوى ذات الأولوية العالية",
      ],
      supporterAnalytics: [
        "إجمالي الشكاوى",
        "الشكاوى المنجزة",
        "الشكاوى المفتوحة",
        "الشكاوى ذات الأولوية العالية",
      ],
      vsLast: "مقارنة بالشهر الماضي",
    },
    profile: {
      title: "ملفك الشخصي",
      user_name: "المستخدم",
      passwordForm: {
        oldPass: "كلمة المرور الحالية",
        newPass: "كلمة المرور الجديدة",
        confirmNewPass: "تأكيد كلمة المرور الجديدة",
        btn: "تأكيد",
      },
    },
    search: {
      placeholder: "بحث...",
      selectCol: "حدد عمود",
    },
  },
};

const languageSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    changeLang: (state, action: PayloadAction<{ lang: "ar" | "en" }>) => {
      state.lang = action.payload.lang;
    },
  },
});

export const { changeLang } = languageSlice.actions;
export const getCurrLang = () => (state: RootState) => state.language.lang;
export const getPageTrans =
  <K extends keyof pages>(pageName: K) =>
  (state: RootState) =>
    state.language[state.language.lang][pageName] as pages[K];
export default languageSlice.reducer;
