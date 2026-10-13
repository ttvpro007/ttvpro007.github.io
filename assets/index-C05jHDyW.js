import{j as e,c as N,p as x}from"./index-9guueE0A.js";import{r as a,m as j}from"./motion-aZtqvxQl.js";import{S as H,H as V,C as M}from"./SocialLinks-DgctO3dj.js";import{C as L}from"./Card-BvFNF1N6.js";import"./react-CLyQEj53.js";function I(r){const i=r.name||"Unknown Adventurer",n=r.email||"Unknown Realm",d=r.details||"",u=r.role||"Wanderer",c=r.questType||"Mystery",t=["Sir","Lady","Archmage","Rogue","Paladin","Druid","Bard","Ranger","Warlock","Champion","Squire","Oracle","Warden","Alchemist","Beastmaster","Necromancer","Artificer","Monk","Barbarian","Sorcerer","Knight","Assassin","Enchanter","Seeker","Guardian","Witch","Hunter","Inventor","Mystic","Valkyrie","Samurai","Ninja","Gunslinger","Shaman","Templar","Sage","Witcher","Dragonborn","Hero","Villager","Merchant","Smith","Scholar","Explorer","Pirate","Captain","Admiral","Commander","Scout","Outlaw","Champion","Wanderer"],f=t[Math.floor(Math.random()*t.length)],m=["🟢 Easy","🟡 Moderate","🟠 Challenging","🔴 Heroic","🟣 Legendary","⚫️ Mythic","🌟 Epic","💀 Deadly","✨ Enchanted","🔥 Infernal","❄️ Frostbitten","🌪️ Chaotic","🌈 Whimsical"],g=m[Math.floor(Math.random()*m.length)],s=["1000 XP","A chest of gold","A rare artifact","A legendary weapon","A magical companion","A secret map","A favor from the guild","A mysterious potion","A badge of honor","A scroll of wisdom","A dragon egg","A bag of enchanted beans","A ticket to the next adventure","A shiny badge","A new title","A blessing from the gods","A handshake from the king","A song written in your honor","A magical mount","A rare gem","A piece of ancient lore"],b=s[Math.floor(Math.random()*s.length)],E=["A new quest has arrived at the guild hall!","A mysterious scroll has appeared on your desk...","A carrier pigeon delivers a sealed letter:","A magical portal shimmers and a message emerges:","A town crier shouts the news across the land:","A bard sings of a new adventure:","A glowing rune stone pulses with a message:","A secret agent hands you a coded scroll:","A talking cat delivers a quest:","A thunderclap heralds a new mission:","A whisper in the wind brings a challenge:","A royal decree is posted on the quest board:","A fortune teller reveals a new opportunity:","A goblin courier drops off a note:","A magical mirror reveals a plea for help:"];return`
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
                ${E[Math.floor(Math.random()*E.length)]}
            </div>
            
            <div class="quest-info">
                <div class="quest-field">
                    <span class="quest-icon">🧙‍♂️</span>
                    <span class="quest-label">From:</span>
                    <span class="quest-value">${f} ${i} &lt;${n}&gt;</span>
                </div>
                
                <div class="quest-field">
                    <span class="quest-icon">🎭</span>
                    <span class="quest-label">Role/Class:</span>
                    <span class="quest-value">${u}</span>
                </div>
                
                <div class="quest-field">
                    <span class="quest-icon">🗺️</span>
                    <span class="quest-label">Quest Type:</span>
                    <span class="quest-value">${c}</span>
                </div>
                
                <div class="quest-field">
                    <span class="quest-icon">⚔️</span>
                    <span class="quest-label">Difficulty:</span>
                    <span class="quest-value">${g}</span>
                </div>
            </div>
            
            <div class="quest-details">
                <div class="quest-details-content">
                    "${d}"
                </div>
            </div>
            
            <div class="quest-reward">
                <div class="reward-label">🏆 Reward (Rumored)</div>
                <div class="reward-value">${b}</div>
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
  `}const h={MIN_MESSAGE_LENGTH:10,MAX_MESSAGE_LENGTH:2e3,RATE_LIMIT_COOLDOWN:6e4,SUBMISSION_DELAY:3e3,DEFAULT_MAX_PROGRESS:100,DEFAULT_PROGRESS_PER_FIELD:0},_={HONEYPOT_FIELDS:["website","email_confirm"],SUSPICIOUS_CONTENT:[/http[s]?:\/\//i,/[A-Z]{5,}/g,/\b(spam|viagra|casino|poker|lottery|make money|earn money|weight loss|free money|get rich)\b/i],EMAIL_REGEX:/^[^\s@]+@[^\s@]+\.[^\s@]+$/},P={DEFAULT_METHOD:"POST",SUBJECT:"⚔️ New Quest Alert! 🗺️",TEMPLATE:"table",CAPTCHA:!1,AUTORESPONSE:"🎉 Thank you for your quest submission! I'll review your message and get back to you soon. Your adventure awaits! 🏰",BLACKLIST:"spam,viagra,casino,poker,lottery,make money fast,work from home,earn money online,weight loss,free money,click here,limited time,act now,urgent,exclusive offer,guaranteed,no risk,100% free,amazing results,miracle cure"},O=r=>{for(const n of _.HONEYPOT_FIELDS)if(r[n]&&r[n].trim()!=="")return console.log("Spam detected: honeypot field filled"),!1;const i=r.details||"";for(const n of _.SUSPICIOUS_CONTENT)if(n.test(i))return console.log("Spam detected: suspicious content"),!1;return i.length<h.MIN_MESSAGE_LENGTH||i.length>h.MAX_MESSAGE_LENGTH?(alert("📜 Quest details should be between 10 and 2000 characters!"),!1):_.EMAIL_REGEX.test(r.email||"")?!0:(alert("📧 Please enter a valid email address!"),!1)},R=(r,i,n,d)=>{const u=r.filter(f=>{const m=i[f.id];return m&&m.trim()!==""}).length,c=Number(n)||h.DEFAULT_PROGRESS_PER_FIELD,t=Number(d)||h.DEFAULT_MAX_PROGRESS;return Math.min(u*c,t)},z=a.forwardRef(function({formFields:i,submitLabel:n,progressPerField:d,maxProgress:u,onInputChange:c,formData:t,onSubmit:f,formConfig:m,onConfettiTrigger:g},s){const[b,E]=a.useState(0),[D,k]=a.useState(!1),[A,w]=a.useState(0);a.useEffect(()=>{const o=R(i,t,d,u);E(o)},[t,i,d,u]);const y=a.useCallback((o,l)=>{c&&c(o,l)},[c]),q=a.useCallback(()=>{s?.current?.form&&(s.current.form.target="_blank",s.current.form.submit(),setTimeout(()=>{s.current.form&&(s.current.form.target="_self")},100))},[s]),S=a.useCallback(o=>{if(o.preventDefault(),!O(t))return;const l=Date.now();if(l-A<h.RATE_LIMIT_COOLDOWN){alert("⏰ Please wait a moment before submitting another quest!");return}const Q=Number(u)||h.DEFAULT_MAX_PROGRESS;if(b>=Q&&!D){if(k(!0),w(l),g&&g(),s?.current?.hiddenMessage){const v=I(t);s.current.hiddenMessage.value=v,console.log("Formatted RPG HTML template for email body:",v)}setTimeout(()=>{f&&f(o),q(),k(!1)},h.SUBMISSION_DELAY)}},[t,A,b,u,D,s,f,q,g]),G=a.useCallback(o=>{const l=t[o.id]||"",v=`quest-field${l&&l.trim()!==""?" valid":""}`;switch(o.type){case"select":return e.jsxDEV("select",{value:l,onChange:p=>y(o.id,p.target.value),className:v,required:o.required,children:[e.jsxDEV("option",{value:"",children:["Select your ",o.label.toLowerCase(),"..."]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:268,columnNumber:13},this),o.options.map(p=>e.jsxDEV("option",{value:p,children:p},p,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:270,columnNumber:15},this))]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:262,columnNumber:11},this);case"textarea":return e.jsxDEV("textarea",{value:l,onChange:p=>y(o.id,p.target.value),placeholder:o.placeholder,className:`${v}${o.id==="details"?" quest-details":""}`,required:o.required,rows:4},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:277,columnNumber:11},this);default:return e.jsxDEV("input",{type:o.type,value:l,onChange:p=>y(o.id,p.target.value),placeholder:o.placeholder,className:v,required:o.required},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:289,columnNumber:11},this)}},[t,y]),F=Number(u)||h.DEFAULT_MAX_PROGRESS,C=b>=F,U=`quest-submit${C?" ready":""}${D?" submitting":""}`,T=a.useMemo(()=>`${b/F*100}%`,[b,F]);return e.jsxDEV("form",{ref:o=>{s?.current&&(s.current.form=o)},action:m?.action,method:m?.method||P.DEFAULT_METHOD,className:"quest-form",children:e.jsxDEV(L,{className:"quest-form-container",hover:!1,children:[e.jsxDEV("div",{className:"xp-progress-container",children:[e.jsxDEV("div",{className:"xp-label",children:[e.jsxDEV("span",{className:"xp-icon",children:"⚡"},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:332,columnNumber:13},this),"Quest Progress: ",b,"/",F]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:331,columnNumber:11},this),e.jsxDEV("div",{className:"xp-bar",children:e.jsxDEV(j.div,{className:"xp-fill",initial:{width:0},animate:{width:T},transition:{duration:.1,ease:"easeInOut"}},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:336,columnNumber:13},this)},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:335,columnNumber:11},this)]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:330,columnNumber:9},this),e.jsxDEV("div",{className:"form-fields",children:i.map((o,l)=>e.jsxDEV(j.div,{className:"field-container",initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.4,delay:l*.1},children:[e.jsxDEV("label",{className:"field-label",children:[e.jsxDEV("span",{className:"label-icon",children:"📜"},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:356,columnNumber:17},this),o.label]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:355,columnNumber:15},this),G(o)]},o.id,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:348,columnNumber:13},this))},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:346,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"_replyto",value:t.email||""},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:365,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"_subject",value:P.SUBJECT},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:366,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"_captcha",value:P.CAPTCHA},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:367,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"_template",value:P.TEMPLATE},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:368,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"_autoresponse",value:P.AUTORESPONSE},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:369,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"_blacklist",value:P.BLACKLIST},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:370,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"name",value:t.name||""},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:373,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"email",value:t.email||""},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:374,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"role",value:t.role||""},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:375,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"questType",value:t.questType||""},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:376,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"details",value:t.details||""},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:377,columnNumber:9},this),e.jsxDEV("input",{type:"hidden",name:"message",ref:o=>{s?.current&&(s.current.hiddenMessage=o)}},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:380,columnNumber:9},this),e.jsxDEV("div",{style:{display:"none"},children:[e.jsxDEV("input",{type:"text",name:"website",tabIndex:"-1",autoComplete:"off"},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:390,columnNumber:11},this),e.jsxDEV("input",{type:"email",name:"email_confirm",tabIndex:"-1",autoComplete:"off"},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:391,columnNumber:11},this)]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:389,columnNumber:9},this),e.jsxDEV("div",{className:"quest-submit-container",children:e.jsxDEV(j.button,{type:"submit",className:`${U} center-submit`,disabled:!C,whileHover:C?{scale:1.02}:{},whileTap:C?{scale:.98}:{},animate:C?{boxShadow:["0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)","0 0 30px color-mix(in srgb, var(--color-primary) 60%, transparent)","0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)"]}:{},transition:{duration:2,repeat:1/0},onClick:S,children:[e.jsxDEV("span",{className:"submit-icon",children:"💎"},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:412,columnNumber:13},this),n]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:396,columnNumber:11},this)},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:395,columnNumber:9},this)]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:328,columnNumber:7},this)},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/features/forms/QuestForm/QuestForm.jsx",lineNumber:319,columnNumber:5},this)}),$={angle:90,spread:60,startVelocity:35,elementCount:50,dragFriction:.1,duration:3e3,stagger:0,width:"10px",height:"10px",perspective:"500px",colors:["#a864fd","#29cdff","#78ff44","#ff718d","#fdff6a"]};function J(){const[r,i]=a.useState({}),[n,d]=a.useState(!1),u=a.useRef({form:null,hiddenMessage:null}),c=(f,m)=>{i(g=>({...g,[f]:m}))},t=()=>{d(!0),setTimeout(()=>d(!1),700)};return e.jsxDEV("section",{className:"contact-section",children:[e.jsxDEV(j.div,{initial:{opacity:0,y:40},animate:{opacity:1,y:0},transition:{duration:.7,ease:"easeOut"},className:"contact-header-banner",children:[e.jsxDEV("h1",{className:"header-1 contact-header-title",children:[e.jsxDEV("span",{style:{marginRight:"0.5rem"},children:"🗺️"},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:55,columnNumber:11},this),N.content.titleText]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:54,columnNumber:9},this),e.jsxDEV("p",{className:"body-text contact-header-subtitle",children:[e.jsxDEV("span",{style:{marginRight:"0.5rem"},children:"📜"},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:59,columnNumber:11},this),N.content.subtitleText]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:58,columnNumber:9},this)]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:48,columnNumber:7},this),e.jsxDEV("div",{className:"quest-content-grid",children:[e.jsxDEV("div",{className:"contact-sidebar",children:[e.jsxDEV(H,{socialLinks:x.socialLinks},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:69,columnNumber:11},this),e.jsxDEV(V,{title:x.hq.title,location:x.hq.location,coordinates:x.hq.coordinates,timezone:x.hq.timezone,status:x.hq.status,description:x.hq.description,icon:x.hq.icon},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:71,columnNumber:11},this)]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:67,columnNumber:9},this),e.jsxDEV(z,{ref:u,formFields:N.formFields,submitLabel:N.content.submitLabel,progressPerField:N.formConfig.progressPerField,maxProgress:N.formConfig.maxProgress,onInputChange:c,formData:r,formConfig:N.formConfig,onConfettiTrigger:t},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:82,columnNumber:9},this)]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:65,columnNumber:7},this),e.jsxDEV("div",{className:"quest-confetti-container",children:e.jsxDEV(M,{active:n,config:$},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:97,columnNumber:9},this)},void 0,!1,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:96,columnNumber:7},this)]},void 0,!0,{fileName:"C:/Users/tuxed/Documents/GitHub/Personal/Portfolio/node_modules/@loom/kit-portfolio/src/pages/contact/Contact.jsx",lineNumber:46,columnNumber:5},this)}export{J as default};
