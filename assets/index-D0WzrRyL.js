import{j as e,m as w,r as l}from"./motion-Bcp_Fv1Z.js";import{I as L,C as z}from"./SocialLinks-COKuptkh.js";import{p as x}from"./index-GsUNfT11.js";import{C as O}from"./Card-07f65HY0.js";import"./react-DJG_os-6.js";const G={titleText:"Embark on a New Adventure!",subtitleText:"Send me a quest below.",submitLabel:"Send Quest"},D={action:"https://formsubmit.co/vitiet.programmer@gmail.com",method:"POST",progressPerField:20,maxProgress:100},H=[{id:"name",label:"Adventurer's Name",type:"text",placeholder:"What do the bards call you?",required:!0},{id:"email",label:"Adventurer's Email",type:"email",placeholder:"Where can the guild reach you?",required:!0},{id:"role",label:"Role/Class",type:"select",options:["Developer","Designer","Project Manager","Recruiter","Other"],required:!0},{id:"questType",label:"Quest Type",type:"select",options:["Collaboration","Job Opportunity","Freelance Work","Question","Just Saying Hi"],required:!0},{id:"details",label:"Quest Details",type:"textarea",placeholder:"Describe the mission you have in mind...",required:!0}],v={content:G,formConfig:D,formFields:H},$=({title:i="Headquarters",location:s="Digital Realm",coordinates:r="0x0, 0y0",timezone:m="UTC+0",status:o="Online",description:u="My digital command center where I craft games and code adventures.",icon:a="🏰",style:p={},...d})=>{const h=`hq-status ${o.toLowerCase()}`;return e.jsxs("div",{className:"hq-container",style:p,...d,children:[e.jsxs("div",{className:"hq-header",children:[e.jsxs("h3",{className:"hq-title",children:[e.jsx(L,{emoji:a,size:"large",className:"hq-icon"}),i]}),e.jsxs("div",{className:h,children:[e.jsx("div",{className:"hq-status-dot"}),e.jsx("span",{className:"hq-status-text",children:o})]})]}),e.jsxs("div",{className:"hq-location-info",children:[e.jsxs("div",{className:"hq-info-item",children:[e.jsx("span",{className:"hq-info-icon",children:"📍"}),e.jsx("span",{className:"hq-info-text",children:s})]}),e.jsxs("div",{className:"hq-info-item",children:[e.jsx("span",{className:"hq-info-icon",children:"🎯"}),e.jsx("span",{className:"hq-info-text coordinates",children:r})]}),e.jsxs("div",{className:"hq-info-item",children:[e.jsx("span",{className:"hq-info-icon",children:"⏰"}),e.jsx("span",{className:"hq-info-text timezone",children:m})]})]}),e.jsx("p",{className:"hq-description",children:u}),e.jsx("div",{className:"hq-map-grid"})]})},Q=e.jsxs("svg",{width:"1.5em",height:"1.5em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("rect",{width:"24",height:"24",rx:"6",fill:"#d44638"}),e.jsx("path",{d:"M5 8.5V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5l-7 5-7-5Z",fill:"#fff"}),e.jsx("path",{d:"M19 7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1l7 5 7-5Z",fill:"#fff"})]});function W({socialLinks:i}){return e.jsx(O,{hover:!1,children:e.jsxs("div",{className:"social-links-container",children:[e.jsxs("h3",{className:"social-links-title",children:[e.jsx(L,{emoji:"🏕️",size:"large",className:"social-links-title-icon"}),"Social Links"]}),e.jsx("div",{className:"social-links-list",children:i.map((s,r)=>e.jsxs(w.a,{href:s.url,target:"_blank",rel:"noopener noreferrer",className:"social-link-item",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4,delay:.3+r*.1},whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx("span",{className:"social-link-icon",children:s.icon==="email-svg"?Q:s.icon&&s.icon.startsWith("http")?e.jsx("img",{src:s.icon,alt:s.name+" icon",style:{width:"1.5em",height:"1.5em",verticalAlign:"middle"}}):null}),e.jsx("span",{className:"social-link-name",children:s.name})]},s.name))})]})})}function V(i){const s=i.name||"Unknown Adventurer",r=i.email||"Unknown Realm",m=i.details||"",o=i.role||"Wanderer",u=i.questType||"Mystery",a=["Sir","Lady","Archmage","Rogue","Paladin","Druid","Bard","Ranger","Warlock","Champion","Squire","Oracle","Warden","Alchemist","Beastmaster","Necromancer","Artificer","Monk","Barbarian","Sorcerer","Knight","Assassin","Enchanter","Seeker","Guardian","Witch","Hunter","Inventor","Mystic","Valkyrie","Samurai","Ninja","Gunslinger","Shaman","Templar","Sage","Witcher","Dragonborn","Hero","Villager","Merchant","Smith","Scholar","Explorer","Pirate","Captain","Admiral","Commander","Scout","Outlaw","Champion","Wanderer"],p=a[Math.floor(Math.random()*a.length)],d=["🟢 Easy","🟡 Moderate","🟠 Challenging","🔴 Heroic","🟣 Legendary","⚫️ Mythic","🌟 Epic","💀 Deadly","✨ Enchanted","🔥 Infernal","❄️ Frostbitten","🌪️ Chaotic","🌈 Whimsical"],h=d[Math.floor(Math.random()*d.length)],n=["1000 XP","A chest of gold","A rare artifact","A legendary weapon","A magical companion","A secret map","A favor from the guild","A mysterious potion","A badge of honor","A scroll of wisdom","A dragon egg","A bag of enchanted beans","A ticket to the next adventure","A shiny badge","A new title","A blessing from the gods","A handshake from the king","A song written in your honor","A magical mount","A rare gem","A piece of ancient lore"],g=n[Math.floor(Math.random()*n.length)],j=["A new quest has arrived at the guild hall!","A mysterious scroll has appeared on your desk...","A carrier pigeon delivers a sealed letter:","A magical portal shimmers and a message emerges:","A town crier shouts the news across the land:","A bard sings of a new adventure:","A glowing rune stone pulses with a message:","A secret agent hands you a coded scroll:","A talking cat delivers a quest:","A thunderclap heralds a new mission:","A whisper in the wind brings a challenge:","A royal decree is posted on the quest board:","A fortune teller reveals a new opportunity:","A goblin courier drops off a note:","A magical mirror reveals a plea for help:"];return`
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
                ${j[Math.floor(Math.random()*j.length)]}
            </div>
            
            <div class="quest-info">
                <div class="quest-field">
                    <span class="quest-icon">🧙‍♂️</span>
                    <span class="quest-label">From:</span>
                    <span class="quest-value">${p} ${s} &lt;${r}&gt;</span>
                </div>
                
                <div class="quest-field">
                    <span class="quest-icon">🎭</span>
                    <span class="quest-label">Role/Class:</span>
                    <span class="quest-value">${o}</span>
                </div>
                
                <div class="quest-field">
                    <span class="quest-icon">🗺️</span>
                    <span class="quest-label">Quest Type:</span>
                    <span class="quest-value">${u}</span>
                </div>
                
                <div class="quest-field">
                    <span class="quest-icon">⚔️</span>
                    <span class="quest-label">Difficulty:</span>
                    <span class="quest-value">${h}</span>
                </div>
            </div>
            
            <div class="quest-details">
                <div class="quest-details-content">
                    "${m}"
                </div>
            </div>
            
            <div class="quest-reward">
                <div class="reward-label">🏆 Reward (Rumored)</div>
                <div class="reward-value">${g}</div>
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
  `}const b={MIN_MESSAGE_LENGTH:10,MAX_MESSAGE_LENGTH:2e3,RATE_LIMIT_COOLDOWN:6e4,SUBMISSION_DELAY:3e3,DEFAULT_MAX_PROGRESS:100,DEFAULT_PROGRESS_PER_FIELD:0},S={HONEYPOT_FIELDS:["website","email_confirm"],SUSPICIOUS_CONTENT:[/http[s]?:\/\//i,/[A-Z]{5,}/g,/\b(spam|viagra|casino|poker|lottery|make money|earn money|weight loss|free money|get rich)\b/i],EMAIL_REGEX:/^[^\s@]+@[^\s@]+\.[^\s@]+$/},y={DEFAULT_ACTION:"https://formsubmit.co/vitiet.programmer@gmail.com",DEFAULT_METHOD:"POST",SUBJECT:"⚔️ New Quest Alert! 🗺️",TEMPLATE:"table",CAPTCHA:!1,AUTORESPONSE:"🎉 Thank you for your quest submission! I'll review your message and get back to you soon. Your adventure awaits! 🏰",BLACKLIST:"spam,viagra,casino,poker,lottery,make money fast,work from home,earn money online,weight loss,free money,click here,limited time,act now,urgent,exclusive offer,guaranteed,no risk,100% free,amazing results,miracle cure"},B=i=>{for(const r of S.HONEYPOT_FIELDS)if(i[r]&&i[r].trim()!=="")return console.log("Spam detected: honeypot field filled"),!1;const s=i.details||"";for(const r of S.SUSPICIOUS_CONTENT)if(r.test(s))return console.log("Spam detected: suspicious content"),!1;return s.length<b.MIN_MESSAGE_LENGTH||s.length>b.MAX_MESSAGE_LENGTH?(alert("📜 Quest details should be between 10 and 2000 characters!"),!1):S.EMAIL_REGEX.test(i.email||"")?!0:(alert("📧 Please enter a valid email address!"),!1)},X=(i,s,r,m)=>{const o=i.filter(p=>{const d=s[p.id];return d&&d.trim()!==""}).length,u=Number(r)||b.DEFAULT_PROGRESS_PER_FIELD,a=Number(m)||b.DEFAULT_MAX_PROGRESS;return Math.min(o*u,a)},Y=l.forwardRef(function({formFields:s,submitLabel:r,progressPerField:m,maxProgress:o,onInputChange:u,formData:a,onSubmit:p,formConfig:d,onConfettiTrigger:h},n){const[g,j]=l.useState(0),[N,C]=l.useState(!1),[_,I]=l.useState(0);l.useEffect(()=>{const t=X(s,a,m,o);j(t)},[a,s,m,o]);const T=l.useCallback((t,c)=>{u&&u(t,c)},[u]),M=l.useCallback(()=>{n?.current?.form&&(n.current.form.target="_blank",n.current.form.submit(),setTimeout(()=>{n.current.form&&(n.current.form.target="_self")},100))},[n]),R=l.useCallback(t=>{if(t.preventDefault(),!B(a))return;const c=Date.now();if(c-_<b.RATE_LIMIT_COOLDOWN){alert("⏰ Please wait a moment before submitting another quest!");return}const k=Number(o)||b.DEFAULT_MAX_PROGRESS;if(g>=k&&!N){if(C(!0),I(c),h&&h(),n?.current?.hiddenMessage){const q=V(a);n.current.hiddenMessage.value=q,console.log("Formatted RPG HTML template for email body:",q)}setTimeout(()=>{p&&p(t),M(),C(!1)},b.SUBMISSION_DELAY)}},[a,_,g,o,N,n,p,M,h]),P=l.useCallback(t=>{const c=a[t.id]||"",q=`quest-field${c&&c.trim()!==""?" valid":""}`;switch(t.type){case"select":return e.jsxs("select",{value:c,onChange:f=>T(t.id,f.target.value),className:q,required:t.required,children:[e.jsxs("option",{value:"",children:["Select your ",t.label.toLowerCase(),"..."]}),t.options.map(f=>e.jsx("option",{value:f,children:f},f))]});case"textarea":return e.jsx("textarea",{value:c,onChange:f=>T(t.id,f.target.value),placeholder:t.placeholder,className:`${q}${t.id==="details"?" quest-details":""}`,required:t.required,rows:4});default:return e.jsx("input",{type:t.type,value:c,onChange:f=>T(t.id,f.target.value),placeholder:t.placeholder,className:q,required:t.required})}},[a,T]),E=Number(o)||b.DEFAULT_MAX_PROGRESS,A=g>=E,F=`quest-submit${A?" ready":""}${N?" submitting":""}`,U=l.useMemo(()=>`${g/E*100}%`,[g,E]);return e.jsx("form",{ref:t=>{n?.current&&(n.current.form=t)},action:d?.action||y.DEFAULT_ACTION,method:d?.method||y.DEFAULT_METHOD,className:"quest-form",children:e.jsxs(O,{className:"quest-form-container",hover:!1,children:[e.jsxs("div",{className:"xp-progress-container",children:[e.jsxs("div",{className:"xp-label",children:[e.jsx("span",{className:"xp-icon",children:"⚡"}),"Quest Progress: ",g,"/",E]}),e.jsx("div",{className:"xp-bar",children:e.jsx(w.div,{className:"xp-fill",initial:{width:0},animate:{width:U},transition:{duration:.1,ease:"easeInOut"}})})]}),e.jsx("div",{className:"form-fields",children:s.map((t,c)=>e.jsxs(w.div,{className:"field-container",initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.4,delay:c*.1},children:[e.jsxs("label",{className:"field-label",children:[e.jsx("span",{className:"label-icon",children:"📜"}),t.label]}),P(t)]},t.id))}),e.jsx("input",{type:"hidden",name:"_replyto",value:a.email||""}),e.jsx("input",{type:"hidden",name:"_subject",value:y.SUBJECT}),e.jsx("input",{type:"hidden",name:"_captcha",value:y.CAPTCHA}),e.jsx("input",{type:"hidden",name:"_template",value:y.TEMPLATE}),e.jsx("input",{type:"hidden",name:"_autoresponse",value:y.AUTORESPONSE}),e.jsx("input",{type:"hidden",name:"_blacklist",value:y.BLACKLIST}),e.jsx("input",{type:"hidden",name:"name",value:a.name||""}),e.jsx("input",{type:"hidden",name:"email",value:a.email||""}),e.jsx("input",{type:"hidden",name:"role",value:a.role||""}),e.jsx("input",{type:"hidden",name:"questType",value:a.questType||""}),e.jsx("input",{type:"hidden",name:"details",value:a.details||""}),e.jsx("input",{type:"hidden",name:"message",ref:t=>{n?.current&&(n.current.hiddenMessage=t)}}),e.jsxs("div",{style:{display:"none"},children:[e.jsx("input",{type:"text",name:"website",tabIndex:"-1",autoComplete:"off"}),e.jsx("input",{type:"email",name:"email_confirm",tabIndex:"-1",autoComplete:"off"})]}),e.jsx("div",{className:"quest-submit-container",children:e.jsxs(w.button,{type:"submit",className:`${F} center-submit`,disabled:!A,whileHover:A?{scale:1.02}:{},whileTap:A?{scale:.98}:{},animate:A?{boxShadow:["0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)","0 0 30px color-mix(in srgb, var(--color-primary) 60%, transparent)","0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)"]}:{},transition:{duration:2,repeat:1/0},onClick:R,children:[e.jsx("span",{className:"submit-icon",children:"💎"}),r]})})]})})}),J={angle:90,spread:60,startVelocity:35,elementCount:50,dragFriction:.1,duration:3e3,stagger:0,width:"10px",height:"10px",perspective:"500px",colors:["#a864fd","#29cdff","#78ff44","#ff718d","#fdff6a"]};function ae(){const[i,s]=l.useState({}),[r,m]=l.useState(!1),o=l.useRef({form:null,hiddenMessage:null}),u=(p,d)=>{s(h=>({...h,[p]:d}))},a=()=>{m(!0),setTimeout(()=>m(!1),700)};return e.jsx("main",{children:e.jsx("div",{className:"body-panel",children:e.jsxs("section",{className:"contact-section",children:[e.jsxs(w.div,{initial:{opacity:0,y:40},animate:{opacity:1,y:0},transition:{duration:.7,ease:"easeOut"},className:"contact-header-banner",children:[e.jsxs("h1",{className:"header-1 contact-header-title",children:[e.jsx("span",{style:{marginRight:"0.5rem"},children:"🗺️"}),v.content.titleText]}),e.jsxs("p",{className:"body-text contact-header-subtitle",children:[e.jsx("span",{style:{marginRight:"0.5rem"},children:"📜"}),v.content.subtitleText]})]}),e.jsxs("div",{className:"quest-content-grid",children:[e.jsxs("div",{className:"contact-sidebar",children:[e.jsx(W,{socialLinks:x.socialLinks}),e.jsx($,{title:x.hq.title,location:x.hq.location,coordinates:x.hq.coordinates,timezone:x.hq.timezone,status:x.hq.status,description:x.hq.description,icon:x.hq.icon})]}),e.jsx(Y,{ref:o,formFields:v.formFields,submitLabel:v.content.submitLabel,progressPerField:v.formConfig.progressPerField,maxProgress:v.formConfig.maxProgress,onInputChange:u,formData:i,formConfig:v.formConfig,onConfettiTrigger:a})]}),e.jsx("div",{className:"quest-confetti-container",children:e.jsx(z,{active:r,config:J})})]})})})}export{ae as default};
