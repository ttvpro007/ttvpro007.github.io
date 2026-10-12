import{r,j as e,m as C}from"./motion-Bcp_Fv1Z.js";import{S as F,H as U,C as G}from"./SocialLinks-BXoZdoGT.js";import{p as f}from"./index-CR9VSTq0.js";import{C as z}from"./Card-BvnzFHQJ.js";import"./react-DJG_os-6.js";const D={titleText:"Embark on a New Adventure!",subtitleText:"Send me a quest below.",submitLabel:"Send Quest"},H={action:"https://formsubmit.co/vitiet.programmer@gmail.com",method:"POST",progressPerField:20,maxProgress:100},$=[{id:"name",label:"Adventurer's Name",type:"text",placeholder:"What do the bards call you?",required:!0},{id:"email",label:"Adventurer's Email",type:"email",placeholder:"Where can the guild reach you?",required:!0},{id:"role",label:"Role/Class",type:"select",options:["Developer","Designer","Project Manager","Recruiter","Other"],required:!0},{id:"questType",label:"Quest Type",type:"select",options:["Collaboration","Job Opportunity","Freelance Work","Question","Just Saying Hi"],required:!0},{id:"details",label:"Quest Details",type:"textarea",placeholder:"Describe the mission you have in mind...",required:!0}],v={content:D,formConfig:H,formFields:$};function Q(i){const n=i.name||"Unknown Adventurer",o=i.email||"Unknown Realm",u=i.details||"",d=i.role||"Wanderer",p=i.questType||"Mystery",a=["Sir","Lady","Archmage","Rogue","Paladin","Druid","Bard","Ranger","Warlock","Champion","Squire","Oracle","Warden","Alchemist","Beastmaster","Necromancer","Artificer","Monk","Barbarian","Sorcerer","Knight","Assassin","Enchanter","Seeker","Guardian","Witch","Hunter","Inventor","Mystic","Valkyrie","Samurai","Ninja","Gunslinger","Shaman","Templar","Sage","Witcher","Dragonborn","Hero","Villager","Merchant","Smith","Scholar","Explorer","Pirate","Captain","Admiral","Commander","Scout","Outlaw","Champion","Wanderer"],m=a[Math.floor(Math.random()*a.length)],c=["🟢 Easy","🟡 Moderate","🟠 Challenging","🔴 Heroic","🟣 Legendary","⚫️ Mythic","🌟 Epic","💀 Deadly","✨ Enchanted","🔥 Infernal","❄️ Frostbitten","🌪️ Chaotic","🌈 Whimsical"],b=c[Math.floor(Math.random()*c.length)],s=["1000 XP","A chest of gold","A rare artifact","A legendary weapon","A magical companion","A secret map","A favor from the guild","A mysterious potion","A badge of honor","A scroll of wisdom","A dragon egg","A bag of enchanted beans","A ticket to the next adventure","A shiny badge","A new title","A blessing from the gods","A handshake from the king","A song written in your honor","A magical mount","A rare gem","A piece of ancient lore"],h=s[Math.floor(Math.random()*s.length)],w=["A new quest has arrived at the guild hall!","A mysterious scroll has appeared on your desk...","A carrier pigeon delivers a sealed letter:","A magical portal shimmers and a message emerges:","A town crier shouts the news across the land:","A bard sings of a new adventure:","A glowing rune stone pulses with a message:","A secret agent hands you a coded scroll:","A talking cat delivers a quest:","A thunderclap heralds a new mission:","A whisper in the wind brings a challenge:","A royal decree is posted on the quest board:","A fortune teller reveals a new opportunity:","A goblin courier drops off a note:","A magical mirror reveals a plea for help:"];return`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Quest Alert!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:wght@400;600&display=swap');
        
        body {
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            font-family: 'Crimson Text', serif;
            color: #f4f4f4;
            line-height: 1.6;
        }
        
        .quest-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(145deg, #2d1b69 0%, #1a103f 100%);
            border: 3px solid #d4af37;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.3);
            overflow: hidden;
            position: relative;
        }
        
        .quest-header {
            background: linear-gradient(90deg, #d4af37 0%, #ffd700 50%, #d4af37 100%);
            color: #1a103f;
            padding: 20px;
            text-align: center;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            font-size: 24px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .quest-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .quest-content {
            padding: 30px;
            position: relative;
        }
        
        .quest-intro {
            font-size: 18px;
            color: #ffd700;
            text-align: center;
            margin-bottom: 25px;
            font-style: italic;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .quest-info {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
        }
        
        .quest-field {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }
        
        .quest-field:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .quest-icon {
            font-size: 20px;
            margin-right: 15px;
            min-width: 25px;
        }
        
        .quest-label {
            font-weight: 600;
            color: #ffd700;
            margin-right: 10px;
            font-family: 'Cinzel', serif;
        }
        
        .quest-value {
            color: #f4f4f4;
            flex: 1;
        }
        
        .quest-details {
            background: rgba(255, 255, 255, 0.08);
            border: 2px solid rgba(212, 175, 55, 0.4);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            position: relative;
        }
        
        .quest-details::before {
            content: '📜';
            position: absolute;
            top: -10px;
            left: 20px;
            background: #1a103f;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 16px;
        }
        
        .quest-details-content {
            margin-top: 10px;
            font-style: italic;
            color: #e8e8e8;
            line-height: 1.8;
        }
        
        .quest-reward {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%);
            border: 2px solid #d4af37;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
            position: relative;
            overflow: hidden;
        }
        
        .quest-reward::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
            animation: reward-shimmer 4s infinite;
        }
        
        @keyframes reward-shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .reward-label {
            font-family: 'Cinzel', serif;
            font-weight: 700;
            color: #ffd700;
            font-size: 18px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .reward-value {
            color: #f4f4f4;
            font-size: 16px;
            position: relative;
            z-index: 1;
        }
        
        .quest-call-to-action {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
            border-radius: 10px;
            border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .cta-text {
            font-family: 'Cinzel', serif;
            font-weight: 600;
            color: #ffd700;
            font-size: 20px;
            margin-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .cta-subtext {
            color: #e8e8e8;
            font-style: italic;
        }
        
        .quest-footer {
            background: linear-gradient(90deg, #d4af37 0%, #ffd700 50%, #d4af37 100%);
            color: #1a103f;
            padding: 15px;
            text-align: center;
            font-family: 'Cinzel', serif;
            font-weight: 600;
            font-size: 14px;
        }
        
        @media (max-width: 600px) {
            body { padding: 10px; }
            .quest-content { padding: 20px; }
            .quest-header { font-size: 20px; padding: 15px; }
            .quest-intro { font-size: 16px; }
            .cta-text { font-size: 18px; }
        }
    </style>
</head>
<body>
    <div class="quest-container">
        <div class="quest-header">
            ⚔️ NEW QUEST ALERT! ⚔️
        </div>
        
        <div class="quest-content">
            <div class="quest-intro">
                ${w[Math.floor(Math.random()*w.length)]}
            </div>
            
            <div class="quest-info">
                <div class="quest-field">
                    <span class="quest-icon">🧙‍♂️</span>
                    <span class="quest-label">From:</span>
                    <span class="quest-value">${m} ${n} &lt;${o}&gt;</span>
                </div>
                
                <div class="quest-field">
                    <span class="quest-icon">🎭</span>
                    <span class="quest-label">Role/Class:</span>
                    <span class="quest-value">${d}</span>
                </div>
                
                <div class="quest-field">
                    <span class="quest-icon">🗺️</span>
                    <span class="quest-label">Quest Type:</span>
                    <span class="quest-value">${p}</span>
                </div>
                
                <div class="quest-field">
                    <span class="quest-icon">⚔️</span>
                    <span class="quest-label">Difficulty:</span>
                    <span class="quest-value">${b}</span>
                </div>
            </div>
            
            <div class="quest-details">
                <div class="quest-details-content">
                    "${u}"
                </div>
            </div>
            
            <div class="quest-reward">
                <div class="reward-label">🏆 Reward (Rumored)</div>
                <div class="reward-value">${h}</div>
            </div>
            
            <div class="quest-call-to-action">
                <div class="cta-text">Will you accept this challenge?</div>
                <div class="cta-subtext">Reply to this scroll to begin your quest!</div>
            </div>
        </div>
        
        <div class="quest-footer">
            🏰 Quest Guild - Adventure Awaits! 🏰
        </div>
    </div>
</body>
</html>
  `}const x={MIN_MESSAGE_LENGTH:10,MAX_MESSAGE_LENGTH:2e3,RATE_LIMIT_COOLDOWN:6e4,SUBMISSION_DELAY:3e3,DEFAULT_MAX_PROGRESS:100,DEFAULT_PROGRESS_PER_FIELD:0},N={HONEYPOT_FIELDS:["website","email_confirm"],SUSPICIOUS_CONTENT:[/http[s]?:\/\//i,/[A-Z]{5,}/g,/\b(spam|viagra|casino|poker|lottery|make money|earn money|weight loss|free money|get rich)\b/i],EMAIL_REGEX:/^[^\s@]+@[^\s@]+\.[^\s@]+$/},y={DEFAULT_ACTION:"https://formsubmit.co/vitiet.programmer@gmail.com",DEFAULT_METHOD:"POST",SUBJECT:"⚔️ New Quest Alert! 🗺️",TEMPLATE:"table",CAPTCHA:!1,AUTORESPONSE:"🎉 Thank you for your quest submission! I'll review your message and get back to you soon. Your adventure awaits! 🏰",BLACKLIST:"spam,viagra,casino,poker,lottery,make money fast,work from home,earn money online,weight loss,free money,click here,limited time,act now,urgent,exclusive offer,guaranteed,no risk,100% free,amazing results,miracle cure"},W=i=>{for(const o of N.HONEYPOT_FIELDS)if(i[o]&&i[o].trim()!=="")return console.log("Spam detected: honeypot field filled"),!1;const n=i.details||"";for(const o of N.SUSPICIOUS_CONTENT)if(o.test(n))return console.log("Spam detected: suspicious content"),!1;return n.length<x.MIN_MESSAGE_LENGTH||n.length>x.MAX_MESSAGE_LENGTH?(alert("📜 Quest details should be between 10 and 2000 characters!"),!1):N.EMAIL_REGEX.test(i.email||"")?!0:(alert("📧 Please enter a valid email address!"),!1)},B=(i,n,o,u)=>{const d=i.filter(m=>{const c=n[m.id];return c&&c.trim()!==""}).length,p=Number(o)||x.DEFAULT_PROGRESS_PER_FIELD,a=Number(u)||x.DEFAULT_MAX_PROGRESS;return Math.min(d*p,a)},V=r.forwardRef(function({formFields:n,submitLabel:o,progressPerField:u,maxProgress:d,onInputChange:p,formData:a,onSubmit:m,formConfig:c,onConfettiTrigger:b},s){const[h,w]=r.useState(0),[E,_]=r.useState(!1),[j,L]=r.useState(0);r.useEffect(()=>{const t=B(n,a,u,d);w(t)},[a,n,u,d]);const S=r.useCallback((t,l)=>{p&&p(t,l)},[p]),M=r.useCallback(()=>{s?.current?.form&&(s.current.form.target="_blank",s.current.form.submit(),setTimeout(()=>{s.current.form&&(s.current.form.target="_self")},100))},[s]),O=r.useCallback(t=>{if(t.preventDefault(),!W(a))return;const l=Date.now();if(l-j<x.RATE_LIMIT_COOLDOWN){alert("⏰ Please wait a moment before submitting another quest!");return}const k=Number(d)||x.DEFAULT_MAX_PROGRESS;if(h>=k&&!E){if(_(!0),L(l),b&&b(),s?.current?.hiddenMessage){const A=Q(a);s.current.hiddenMessage.value=A,console.log("Formatted RPG HTML template for email body:",A)}setTimeout(()=>{m&&m(t),M(),_(!1)},x.SUBMISSION_DELAY)}},[a,j,h,d,E,s,m,M,b]),I=r.useCallback(t=>{const l=a[t.id]||"",A=`quest-field${l&&l.trim()!==""?" valid":""}`;switch(t.type){case"select":return e.jsxs("select",{value:l,onChange:g=>S(t.id,g.target.value),className:A,required:t.required,children:[e.jsxs("option",{value:"",children:["Select your ",t.label.toLowerCase(),"..."]}),t.options.map(g=>e.jsx("option",{value:g,children:g},g))]});case"textarea":return e.jsx("textarea",{value:l,onChange:g=>S(t.id,g.target.value),placeholder:t.placeholder,className:`${A}${t.id==="details"?" quest-details":""}`,required:t.required,rows:4});default:return e.jsx("input",{type:t.type,value:l,onChange:g=>S(t.id,g.target.value),placeholder:t.placeholder,className:A,required:t.required})}},[a,S]),T=Number(d)||x.DEFAULT_MAX_PROGRESS,q=h>=T,R=`quest-submit${q?" ready":""}${E?" submitting":""}`,P=r.useMemo(()=>`${h/T*100}%`,[h,T]);return e.jsx("form",{ref:t=>{s?.current&&(s.current.form=t)},action:c?.action||y.DEFAULT_ACTION,method:c?.method||y.DEFAULT_METHOD,className:"quest-form",children:e.jsxs(z,{className:"quest-form-container",hover:!1,children:[e.jsxs("div",{className:"xp-progress-container",children:[e.jsxs("div",{className:"xp-label",children:[e.jsx("span",{className:"xp-icon",children:"⚡"}),"Quest Progress: ",h,"/",T]}),e.jsx("div",{className:"xp-bar",children:e.jsx(C.div,{className:"xp-fill",initial:{width:0},animate:{width:P},transition:{duration:.1,ease:"easeInOut"}})})]}),e.jsx("div",{className:"form-fields",children:n.map((t,l)=>e.jsxs(C.div,{className:"field-container",initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.4,delay:l*.1},children:[e.jsxs("label",{className:"field-label",children:[e.jsx("span",{className:"label-icon",children:"📜"}),t.label]}),I(t)]},t.id))}),e.jsx("input",{type:"hidden",name:"_replyto",value:a.email||""}),e.jsx("input",{type:"hidden",name:"_subject",value:y.SUBJECT}),e.jsx("input",{type:"hidden",name:"_captcha",value:y.CAPTCHA}),e.jsx("input",{type:"hidden",name:"_template",value:y.TEMPLATE}),e.jsx("input",{type:"hidden",name:"_autoresponse",value:y.AUTORESPONSE}),e.jsx("input",{type:"hidden",name:"_blacklist",value:y.BLACKLIST}),e.jsx("input",{type:"hidden",name:"name",value:a.name||""}),e.jsx("input",{type:"hidden",name:"email",value:a.email||""}),e.jsx("input",{type:"hidden",name:"role",value:a.role||""}),e.jsx("input",{type:"hidden",name:"questType",value:a.questType||""}),e.jsx("input",{type:"hidden",name:"details",value:a.details||""}),e.jsx("input",{type:"hidden",name:"message",ref:t=>{s?.current&&(s.current.hiddenMessage=t)}}),e.jsxs("div",{style:{display:"none"},children:[e.jsx("input",{type:"text",name:"website",tabIndex:"-1",autoComplete:"off"}),e.jsx("input",{type:"email",name:"email_confirm",tabIndex:"-1",autoComplete:"off"})]}),e.jsx("div",{className:"quest-submit-container",children:e.jsxs(C.button,{type:"submit",className:`${R} center-submit`,disabled:!q,whileHover:q?{scale:1.02}:{},whileTap:q?{scale:.98}:{},animate:q?{boxShadow:["0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)","0 0 30px color-mix(in srgb, var(--color-primary) 60%, transparent)","0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)"]}:{},transition:{duration:2,repeat:1/0},onClick:O,children:[e.jsx("span",{className:"submit-icon",children:"💎"}),o]})})]})})}),X={angle:90,spread:60,startVelocity:35,elementCount:50,dragFriction:.1,duration:3e3,stagger:0,width:"10px",height:"10px",perspective:"500px",colors:["#a864fd","#29cdff","#78ff44","#ff718d","#fdff6a"]};function te(){const[i,n]=r.useState({}),[o,u]=r.useState(!1),d=r.useRef({form:null,hiddenMessage:null}),p=(m,c)=>{n(b=>({...b,[m]:c}))},a=()=>{u(!0),setTimeout(()=>u(!1),700)};return e.jsxs("section",{className:"contact-section",children:[e.jsxs(C.div,{initial:{opacity:0,y:40},animate:{opacity:1,y:0},transition:{duration:.7,ease:"easeOut"},className:"contact-header-banner",children:[e.jsxs("h1",{className:"header-1 contact-header-title",children:[e.jsx("span",{style:{marginRight:"0.5rem"},children:"🗺️"}),v.content.titleText]}),e.jsxs("p",{className:"body-text contact-header-subtitle",children:[e.jsx("span",{style:{marginRight:"0.5rem"},children:"📜"}),v.content.subtitleText]})]}),e.jsxs("div",{className:"quest-content-grid",children:[e.jsxs("div",{className:"contact-sidebar",children:[e.jsx(F,{socialLinks:f.socialLinks}),e.jsx(U,{title:f.hq.title,location:f.hq.location,coordinates:f.hq.coordinates,timezone:f.hq.timezone,status:f.hq.status,description:f.hq.description,icon:f.hq.icon})]}),e.jsx(V,{ref:d,formFields:v.formFields,submitLabel:v.content.submitLabel,progressPerField:v.formConfig.progressPerField,maxProgress:v.formConfig.maxProgress,onInputChange:p,formData:i,formConfig:v.formConfig,onConfettiTrigger:a})]}),e.jsx("div",{className:"quest-confetti-container",children:e.jsx(G,{active:o,config:X})})]})}export{te as default};
