import { courses, directions, programs } from "./courses";

export type Answers = Record<string, string | string[]>;
type Question = { key: string; title: string; kind: "text" | "number" | "choice" | "multiple"; options?: readonly string[]; hint?: string };
export const interests = [
  "AI CREATOR — генерация изображений", "AI DESIGN — дизайн и брендинг",
  "AI VIDEO — видео и анимация", "AI 3D — трёхмерная графика",
  "AI WEBSITES — создание сайтов", "AI GAMES — разработка игр",
  "AI AGENTS — ИИ-агенты", "AI AUTOMATION — автоматизация",
  "AI MARKETING — продвижение", "AI PRODUCT — создание продуктов",
] as const;
export const questions: Question[] = [
  {key:"firstName",title:"Как вас зовут?",kind:"text",hint:"Имя"},
  {key:"lastName",title:"Ваша фамилия?",kind:"text",hint:"Фамилия"},
  {key:"age",title:"Сколько вам лет?",kind:"number"},
  {key:"usedAI",title:"Пользовались ИИ до этого момента?",kind:"choice",options:["Да, регулярно","Да, несколько раз","Нет, ни разу"]},
  {key:"use",title:"Как вы планируете использовать искусственный интеллект?",kind:"multiple",options:["Для работы","Для творчества и контента","Для своего бизнеса","Для дополнительного заработка","Для учёбы и личных задач","Пока не определился(-ась)"]},
  {key:"level",title:"Какой у вас уровень владения нейросетями?",kind:"choice",options:["Начинающий","Базовый","Средний","Продвинутый"]},
  {key:"work",title:"В какой сфере вы сейчас работаете?",kind:"text",hint:"Например, маркетинг, дизайн, образование"},
  {key:"interests",title:"Какие направления искусственного интеллекта вам интересны?",kind:"multiple",options:interests,hint:"Можно выбрать несколько вариантов"},
  {key:"goal",title:"Какого результата вы хотите достичь с помощью ИИ?",kind:"text",hint:"Например, создать портфолио или автоматизировать работу"},
  {key:"income",title:"Какой ежемесячный доход вы хотели бы получать благодаря ИИ?",kind:"choice",options:["До 30 000 ₽","30 000–70 000 ₽","70 000–150 000 ₽","150 000–300 000 ₽","Более 300 000 ₽","Доход не является целью"]},
  {key:"barrier",title:"Что сейчас мешает вам достичь желаемого результата?",kind:"multiple",options:["Не хватает знаний","Не знаю, с чего начать","Не хватает времени","Нет портфолио","Не знаю, как найти клиентов","Сложно выбрать инструменты","Другое"]},
];
export function sanitizeAnswers(raw: unknown): Answers {
  if (!raw || typeof raw !== "object") return {};
  const obj=raw as Record<string, unknown>;
  const result: Answers={};
  for(const q of questions) {
    const v=obj[q.key];
    if(q.kind==="multiple" && Array.isArray(v)) result[q.key]=[...new Set(v.filter((x):x is string=>typeof x==="string" && !!q.options?.includes(x)))];
    else if(typeof v==="string" && q.kind!=="multiple") {
      if(q.kind==="choice" && !q.options?.includes(v)) continue;
      if(q.kind==="number" && (!/^\d{1,3}$/.test(v)||Number(v)<1||Number(v)>120)) continue;
      result[q.key]=v.trim().slice(0, q.key==="firstName"||q.key==="lastName"?80:500);
    }
  }
  return result;
}
export function answerText(a: Answers,key:string) {const v=a[key];return Array.isArray(v)?v.join(", "):v||"";}
export function recommendations(a: Answers) {
  const picked=Array.isArray(a.interests)?a.interests:[];
  const context=[answerText(a,"work"),answerText(a,"goal"),answerText(a,"use")].join(" ").toLowerCase();
  const terms: Record<string,RegExp>={creator:/контент|соцсет|творчеств|изображ/,design:/дизайн|бренд|визуал|портфолио/,video:/видео|анимац|мультфильм/,three:/3d|3д|трёхмер|трехмер/,websites:/сайт|веб|web/,games:/игр|game/,agents:/агент|бот|помощник/,automation:/автомат|процесс|рутин/,marketing:/маркет|продвиж|клиент|реклам/,product:/бизнес|продукт|предприним/};
  const beginner=a.level==="Начинающий"||a.usedAI==="Нет, ни разу"||a.level==="Базовый";
  const ranked=courses.map(course=>{
    const explicit=picked.some(x=>x.startsWith(course.name+" —"));
    const match=terms[course.theme]?.test(context)||false;
    return {id:course.theme,name:course.name,description:course.description,price:course.price,href:"/courses/"+(directions.find(d=>d.modules.includes(course.name))?.slug||"")+"/",score:(explicit?10:0)+(match?4:0),reason:explicit?"Вы отметили это направление в анкете.":"Соответствует вашим задачам и сфере работы."};
  }).filter(x=>x.score>0).sort((x,y)=>y.score-x.score);
  const basic={id:"basis",name:"BASIC",description:programs[0].description,price:"7 900 ₽",href:"/courses/#programs",score:20,reason:"Поможет освоить основы перед специализацией."};
  return [...(beginner||!ranked.length?[basic]:[]),...ranked].slice(0,4);
}
