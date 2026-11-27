"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type FormEvent } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createAccountClient, canSignUpWithoutConfirmation } from "../data/account-client";
import { questions, sanitizeAnswers, recommendations, answerText, type Answers } from "../data/account-questions";
import { useCart } from "./CourseCart";
import { courses, programs, creativeBundle, customCoursePrice, parseCoursePrice, customProgramMin } from "../data/courses";

type Screen="login"|"forgot"|"reset"|"questions"|"signup"|"confirm"|"account"|"preview";
type Purchase={id:string; product_id:string; product_name:string; description:string; amount:number; purchased_at:string};
const AccountContext=createContext<{open:()=>void;user:User|null}>({open:()=>{},user:null});
const draftKey="multum-onboarding-draft-v1";
const money=(v:number)=>new Intl.NumberFormat("ru-RU").format(v)+" ₽";
const catalogue=[...programs,...courses,{...creativeBundle,description:"AI CREATOR, AI DESIGN и AI VIDEO"}];
function CartSummary({close}:{close:()=>void}) {
  const cart=useCart();
  return <div className="account-basket">
    {(["regular","custom"] as const).map(mode=>{
      const ids=mode==="regular"?cart.regularIds:cart.customIds;
      const items=catalogue.filter(x=>ids.includes(x.theme));
      if(!items.length)return null;
      const total=items.reduce((s,x)=>s+(mode==="custom"?customCoursePrice(parseCoursePrice(x.price)):parseCoursePrice(x.price)),0);
      return <div key={mode} className="account-basket-group"><h4>{mode==="custom"?"Своя программа":"Обычная покупка"}</h4>
        {items.map(x=><div className="account-line" key={x.theme}><div><strong>{x.name}</strong><p>{x.description}</p></div><span>{money(mode==="custom"?customCoursePrice(parseCoursePrice(x.price)):parseCoursePrice(x.price))}</span></div>)}
        <div className="account-line"><strong>{mode==="custom"&&ids.length<customProgramMin?"Предварительно":"Итого"}</strong><strong>{money(total)}</strong></div>
        {mode==="custom"&&ids.length<customProgramMin&&<p className="account-muted">Для оформления выберите ещё {customProgramMin-ids.length} курс(а).</p>}
      </div>;
    })}
    {!cart.regularIds.length&&!cart.customIds.length&&<p className="account-muted">Корзина пока пуста.</p>}
    <button className="account-secondary" type="button" onClick={()=>{close();cart.open();}}>Открыть корзину</button>
    <a className="account-link" href="/courses/#directions">Все направления</a>
  </div>;
}
export function AccountProvider({children}:{children:ReactNode}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const [client,setClient]=useState<SupabaseClient|null>(null);
  const [user,setUser]=useState<User|null>(null);
  const [screen,setScreen]=useState<Screen>("login");
  const [answers,setAnswers]=useState<Answers>({});
  const [step,setStep]=useState(0);
  const [hydrated,setHydrated]=useState(false);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  const [editing,setEditing]=useState(false);
  const [purchases,setPurchases]=useState<Purchase[]>([]);
  const [purchaseStatus,setPurchaseStatus]=useState<"loading"|"ready"|"error">("loading");
  const show=()=>{if(dialog.current&&!dialog.current.open)dialog.current.showModal();};
  const close=()=>{dialog.current?.close();setPassword("");};
  function change(next:Screen){setNotice("");setPassword("");setScreen(next);}
  useEffect(()=>{
    try {const draft=JSON.parse(sessionStorage.getItem(draftKey)||"{}");setAnswers(sanitizeAnswers(draft.answers));setStep(Math.max(0,Math.min(questions.length-1,Number(draft.step)||0)));}catch{}
    setHydrated(true);
    let auth:SupabaseClient|null=null;
    try{auth=createAccountClient();}catch{}
    setClient(auth);
    if(!auth)return;
    const {data:{subscription}}=auth.auth.onAuthStateChange((event,session)=>{
      setUser(session?.user||null);
      if(event==="PASSWORD_RECOVERY"){setScreen("reset");show();}
      else if(event==="SIGNED_OUT"){setScreen("login");setPurchases([]);setAnswers({});setStep(0);try{sessionStorage.removeItem(draftKey);}catch{}}
    });
    return ()=>subscription.unsubscribe();
  },[]);
  useEffect(()=>{
    if(!hydrated||user)return;
    try{sessionStorage.setItem(draftKey,JSON.stringify({answers,step}));}catch{}
  },[answers,step,hydrated,user]);
  useEffect(()=>{
    if(!user||!client){setPurchases([]);return;}
    let active=true;
    setPurchaseStatus("loading");
    client.from("shop_purchases").select("id,product_id,product_name,description,amount,purchased_at").eq("user_id",user.id).order("purchased_at",{ascending:false}).then(({data,error})=>{
      if(active){setPurchases(error?[]:(data||[]) as Purchase[]);setPurchaseStatus(error?"error":"ready");}
    });
    return ()=>{active=false;};
  },[client,user?.id]);
  const profile=sanitizeAnswers(user?.user_metadata?.multum_profile);
  const current=questions[step];
  const value=answers[current.key];
  function open(){change(user?"account":"login");show();}
  function begin(edit=false){setEditing(edit);if(edit){setAnswers(profile);setStep(0);}change("questions");}
  function update(v:string|string[]){setAnswers(prev=>({...prev,[current.key]:v}));}
  async function advance(skip=false){
    const next={...answers};
    if(skip)delete next[current.key];
    else if(current.kind==="number"&&typeof value==="string"&&value!==""&&(!/^\d{1,3}$/.test(value)||Number(value)<1||Number(value)>120)){setNotice("Укажите возраст от 1 до 120 или пропустите вопрос.");return;}
    setAnswers(next);setNotice("");
    if(step<questions.length-1){setStep(step+1);return;}
    if(editing&&client&&user){
      setBusy(true);
      try{const {data,error}=await client.auth.updateUser({data:{multum_profile:sanitizeAnswers(next)}});if(error)throw error;setUser(data.user);change("account");}catch{setNotice("Не удалось сохранить профиль. Повторите попытку.");}finally{setBusy(false);}
    }else change("signup");
  }
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setNotice("");
    if(!client){setNotice("Авторизация пока не подключена. Можно заполнить анкету и посмотреть рекомендации.");return;}
    setBusy(true);
    try{
      const redirect=window.location.origin+"/";
      if(screen==="login"){
        const {data,error}=await client.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;
        setUser(data.user);setAnswers({});setStep(0);try{sessionStorage.removeItem(draftKey);}catch{}change("account");
      }else if(screen==="forgot"){
        const {error}=await client.auth.resetPasswordForEmail(email.trim(),{redirectTo:redirect});if(error)throw error;
        setNotice("Если аккаунт существует, письмо со ссылкой для восстановления отправлено.");
      }else if(screen==="reset"){
        const {data,error}=await client.auth.updateUser({password});if(error)throw error;
        setUser(data.user);change("account");
      }else if(screen==="signup"){
        if (!(await canSignUpWithoutConfirmation())) {
          setNotice("Регистрация без подтверждения почты пока не включена. Попробуйте позднее.");
          return;
        }
        const {data,error}=await client.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:redirect,data:{multum_profile:sanitizeAnswers(answers)}}});
        if(error)throw error;
        if(data.session){setUser(data.user);setAnswers({});setStep(0);change("account");try{sessionStorage.removeItem(draftKey);}catch{}}
        else {setNotice("Не удалось автоматически войти. Обратитесь в поддержку.");}
      }
    }catch{setNotice(screen==="login"?"Не удалось войти. Проверьте почту и пароль.": "Не удалось выполнить действие. Проверьте данные или повторите позже.");}
    finally{setBusy(false);}
  }
  async function signOut(){if(!client)return;setBusy(true);try{const {error}=await client.auth.signOut();if(error)throw error;setUser(null);setAnswers({});setStep(0);setPurchases([]);try{sessionStorage.removeItem(draftKey);}catch{}change("login");}catch{setNotice("Не удалось выйти. Повторите попытку.");}finally{setBusy(false);}}
  const isQuestion=screen==="questions";
  const isProfile=screen==="account"||screen==="preview";
  const displayProfile=screen==="preview"?sanitizeAnswers(answers):profile;
  const recs=recommendations(displayProfile);
  const name=[answerText(displayProfile,"firstName"),answerText(displayProfile,"lastName")].filter(Boolean).join(" ");
  return <AccountContext.Provider value={{open,user}}>{children}
    <dialog ref={dialog} className={"account-dialog"+(isProfile?" account-dialog--wide":"")} aria-labelledby="account-title" onClose={()=>setPassword("")} onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <div className="account-panel">
        <div className="account-header"><span>MULTUM AI</span><button type="button" onClick={close} className="account-close" aria-label="Закрыть">×</button></div>
        {isQuestion?<><div className="account-step"><span>Ваш профиль</span><span>{step+1} / {questions.length}</span></div><progress max={questions.length} value={step+1}/><h2 id="account-title">{current.title}</h2>
          {current.hint&&<p className="account-muted">{current.hint}</p>}
          {current.kind==="choice"||current.kind==="multiple"?<div className="account-choices">{current.options?.map(option=>{
            const selected=Array.isArray(value)?value.includes(option):value===option;
            return <button key={option} type="button" aria-pressed={selected} onClick={()=>update(current.kind==="multiple"?(Array.isArray(value)?selected?value.filter(x=>x!==option):[...value,option]:[option]):option)}>{option}<span aria-hidden="true">{selected?"✓":""}</span></button>;
          })}</div>:<label className="account-field"><span>{current.kind==="number"?"Возраст":"Ваш ответ"}</span><input key={current.key} type={current.kind==="number"?"number":"text"} min={current.kind==="number"?1:undefined} max={current.kind==="number"?120:undefined} maxLength={current.key==="firstName"||current.key==="lastName"?80:500} value={typeof value==="string"?value:""} onChange={e=>update(e.target.value)} placeholder={current.hint||"Введите ответ"}/></label>}
          <div className="account-controls"><button type="button" className="account-secondary" disabled={busy} onClick={()=>step>0?(setStep(step-1),setNotice("")):change(editing?"account":"login")}>Назад</button><button type="button" className="account-link" disabled={busy} onClick={()=>void advance(true)}>Пропустить</button><button type="button" className="account-primary" disabled={busy||!(Array.isArray(value)?value.length:typeof value==="string"&&value.trim())} onClick={()=>void advance()}>{step===questions.length-1?"Готово":"Далее"}</button></div>
        </>:isProfile?<><p className="account-eyebrow">{screen==="preview"?"Предпросмотр анкеты":"Личный кабинет"}</p><h2 id="account-title">{name||"Ваш профиль"}</h2>{screen==="preview"?<p className="account-muted">Это предварительный профиль, аккаунт ещё не создан.</p>:<p className="account-muted">{user?.email}</p>}
          <div className="account-profile-grid">{[["Уровень","level"],["Сфера","work"],["Цель","goal"],["Желаемый доход","income"],["Интересы","interests"],["Что мешает","barrier"]].map(([label,key])=>answerText(displayProfile,key)?<div key={key}><small>{label}</small><p>{answerText(displayProfile,key)}</p></div>:null)}</div>
          <button type="button" className="account-secondary" onClick={()=>{if(screen==="preview"){setStep(0);change("questions");}else begin(true);}}>Изменить ответы</button>
          <section className="account-section"><h3>Рекомендуем вам</h3><p className="account-muted">Подбор по вашим интересам, уровню и задачам. Доход не гарантируется.</p>
            {recs.map(r=><a className="account-recommendation" key={r.id} href={r.href}><div><strong>{r.name}</strong><p>{r.reason}</p></div><span>{r.price} →</span></a>)}
          </section>
          {screen==="account"?<><section className="account-section"><h3>Купленные продукты</h3>{purchaseStatus==="loading"?<p>Загрузка…</p>:purchaseStatus==="error"?<p className="account-muted">Не удалось загрузить покупки.</p>:!purchases.length?<p className="account-muted">Подтверждённых покупок пока нет.</p>:purchases.map(p=><div className="account-line" key={p.id}><div><strong>{p.product_name}</strong><p>{p.description}</p></div><span>{money(p.amount)}</span></div>)}</section>
          <section className="account-section"><h3>В корзине</h3><p className="account-muted">Выбранные курсы в этом браузере.</p><CartSummary close={close}/></section><button className="account-secondary" type="button" disabled={busy} onClick={()=>void signOut()}>Выйти</button></>:<button className="account-primary" type="button" onClick={()=>change("signup")}>Продолжить регистрацию</button>}
        </>:screen==="confirm"?<><h2 id="account-title">Подтвердите почту</h2><p>Откройте письмо со ссылкой для подтверждения. После этого войдите в кабинет.</p><button type="button" className="account-primary" onClick={()=>change("login")}>Ко входу</button></>:<>
          <p className="account-eyebrow">{screen==="signup"?"Завершение регистрации":"Личный кабинет"}</p><h2 id="account-title">{screen==="forgot"?"Восстановление пароля":screen==="reset"?"Новый пароль":screen==="signup"?"Создайте аккаунт":"Вход"}</h2>
          {!client&&<p className="account-muted">Авторизация пока не подключена. Анкету можно пройти в режиме предварительного просмотра.</p>}
          <form className="account-form" onSubmit={submit}>
            {screen!=="reset"&&<label className="account-field"><span>Email</span><input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></label>}
            {screen!=="forgot"&&<label className="account-field"><span>{screen==="reset"?"Новый пароль":"Пароль"}</span><input type="password" required minLength={screen==="login"?1:8} autoComplete={screen==="login"?"current-password":"new-password"} value={password} onChange={e=>setPassword(e.target.value)}/></label>}
            {screen==="signup"&&<p className="account-muted">Ответы сохранятся в вашем профиле после регистрации. Пароль не входит в анкету.</p>}
            <button className="account-primary" type="submit" disabled={busy||!client}>{busy?"Загрузка…":screen==="forgot"?"Отправить ссылку":screen==="reset"?"Сохранить пароль":screen==="signup"?"Зарегистрироваться":"Войти"}</button>
          </form>
          {screen==="login"?<div className="account-auth-links"><button type="button" className="account-link" onClick={()=>begin()}>Регистрация</button><button type="button" className="account-link" onClick={()=>change("forgot")}>Забыли пароль?</button></div>:<button type="button" className="account-link" onClick={()=>change(screen==="signup"?"questions":"login")}>Назад</button>}
          {screen==="signup"&&<button className="account-secondary" type="button" onClick={()=>change("preview")}>Посмотреть мой профиль и рекомендации</button>}
        </>}
        {notice&&<p className="account-notice" role="status">{notice}</p>}
      </div>
    </dialog>
  </AccountContext.Provider>;
}
export function AccountNavButton(){const account=useContext(AccountContext);return <button className="site-nav__item site-nav__login" type="button" onClick={account.open} aria-haspopup="dialog">{account.user?"ACCOUNT":"LOGIN"}</button>;}
