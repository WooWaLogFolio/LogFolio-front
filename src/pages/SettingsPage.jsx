import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AppHeader from "../components/layout/AppHeader";
import naverIcon from "../assets/images/icon-naver.svg";
import kakaoIcon from "../assets/images/icon-kakao.svg";
import { logout } from "../apis/authApi";
import { deleteProjectFile, getStorage } from "../apis/projectApi";
import {
  changePassword,
  getAuthAccounts,
  getUserProfile,
  startAuthAccountLink,
  unlinkAuthAccount,
  updateUserName,
} from "../apis/userApi";

const Page=styled.div`min-height:100vh;background:white;color:${({theme})=>theme.colors.textDark};`;
const Shell=styled.main`display:grid;grid-template-columns:160px minmax(0,620px);gap:40px;width:900px;max-width:calc(100% - 32px);margin:0 auto;padding:60px 40px 80px;@media(max-width:760px){grid-template-columns:1fr;padding:36px 0;}`;
const Sidebar=styled.aside`color:${({theme})=>theme.colors.textGray};font-size:14px;font-weight:700;nav{display:flex;flex-direction:column;gap:2px;padding-top:10px;}button{width:100%;padding:8px 12px;border-radius:8px;color:${({theme})=>theme.colors.textGray};font-size:14px;text-align:left;}button.active{background:${({theme})=>theme.colors.primaryLight};color:${({theme})=>theme.colors.primary};font-weight:700;}@media(max-width:760px){nav{flex-direction:row;}button{width:auto;}}`;
const Main=styled.section`min-width:0;`;
const Heading=styled.h1`font-size:18px;line-height:27px;letter-spacing:-.4px;`;
const Description=styled.p`margin-top:4px;font-size:14px;line-height:22px;`;
const Card=styled.section`margin-top:24px;overflow:hidden;border:1px solid ${({theme})=>theme.colors.border};border-radius:12px;background:white;`;
const Profile=styled.div`display:flex;align-items:center;gap:16px;padding:24px;border-bottom:1px solid ${({theme})=>theme.colors.border};`;
const BigAvatar=styled.div`display:grid;width:56px;height:56px;flex:none;place-items:center;border:2px solid ${({theme})=>theme.colors.border};border-radius:50%;background:${({theme})=>theme.colors.primaryLight};color:${({theme})=>theme.colors.primary};font-size:20px;font-weight:700;`;
const ProfileText=styled.div`strong{display:block;font-size:16px;line-height:24px;}span{color:${({theme})=>theme.colors.textGray};font-size:14px;line-height:21px;}`;
const Row=styled.div`padding:20px 24px;border-bottom:1px solid ${({theme})=>theme.colors.border};`;
const Label=styled.p`color:${({theme})=>theme.colors.textGray};font-size:12px;font-weight:600;line-height:18px;letter-spacing:.72px;`;
const ValueLine=styled.div`display:flex;align-items:center;justify-content:space-between;min-height:29px;padding-top:8px;color:${({$muted,theme})=>$muted?theme.colors.textGray:theme.colors.textDark};font-size:14px;button{color:${({theme})=>theme.colors.textGray};font-size:14px;}`;
const EditLine=styled.div`display:flex;gap:8px;padding-top:8px;input{min-width:0;flex:1;height:43px;padding:0 16px;border:1.5px solid ${({theme})=>theme.colors.primary};border-radius:8px;font:inherit;font-size:16px;&:focus{outline:none;}}`;
const Button=styled.button`height:40px;padding:0 14px;border:1px solid ${({theme})=>theme.colors.border};border-radius:8px;background:white;color:${({theme})=>theme.colors.textGray};font-size:14px;&.primary{border-color:${({theme})=>theme.colors.primary};background:${({theme})=>theme.colors.primary};color:white;font-weight:700;}&:disabled{opacity:.5;}`;
const PasswordForm=styled.form`display:flex;flex-direction:column;gap:10px;padding-top:8px;input{height:48px;padding:0 16px;border:1px solid ${({theme})=>theme.colors.border};border-radius:8px;font:inherit;font-size:16px;&:focus{outline:none;border-color:${({theme})=>theme.colors.primary};}.actions{display:flex;gap:8px;}`;
const SocialList=styled.div`display:flex;flex-direction:column;gap:10px;padding-top:14px;`;
const Social=styled.div`display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border:1px solid ${({$provider,$linked,theme})=>$linked?($provider==="NAVER"?theme.colors.naver:theme.colors.kakao):theme.colors.border};border-radius:10px;background:${({$provider,$linked})=>$linked?($provider==="NAVER"?"#f0fdf4":"#fffde7"):"white"};`;
const SocialInfo=styled.div`display:flex;align-items:center;gap:10px;img{width:32px;height:32px;padding:9px;border-radius:8px;background:${({$provider,theme})=>$provider==="NAVER"?theme.colors.naver:theme.colors.kakao};}strong{display:block;font-size:14px;line-height:22px;}span{display:block;color:${({theme})=>theme.colors.textGray};font-size:12px;line-height:18px;}`;
const SocialButton=styled.button`height:32px;padding:0 14px;border:1px solid ${({$provider,$linked,theme})=>$linked?($provider==="NAVER"?theme.colors.naver:"#e6ce00"):theme.colors.border};border-radius:6px;background:${({$provider,$linked,theme})=>$linked?($provider==="NAVER"?theme.colors.naver:theme.colors.kakao):"white"};color:${({$provider,$linked,theme})=>$linked?($provider==="KAKAO"?theme.colors.kakaoText:"white"):theme.colors.textDark};font-size:12px;font-weight:${({$linked})=>$linked?700:400};`;
const LogoutRow=styled.div`padding:17px 24px;button{color:${({theme})=>theme.colors.textGray};font-size:15px;font-weight:600;}`;
const Notice=styled.p`margin-top:14px;padding:10px 12px;border-radius:8px;background:${({$error,theme})=>$error?"#fef2f2":theme.colors.primaryLight};color:${({$error,theme})=>$error?"#ef4444":theme.colors.primary};font-size:13px;line-height:20px;`;
const StorageCard=styled(Card)`padding:20px;overflow:visible;`;
const StorageTop=styled.div`display:flex;align-items:center;justify-content:space-between;margin-top:4px;strong{font-size:14px;line-height:22px;}span{color:${({theme})=>theme.colors.textFooter};font-size:12px;}`;
const Progress=styled.div`height:6px;margin-top:8px;overflow:hidden;border-radius:3px;background:#f2f4f7;i{display:block;height:100%;border-radius:3px;background:${({theme})=>theme.colors.primary};}`;
const StorageCaption=styled.p`margin-top:6px;color:${({theme})=>theme.colors.textFooter};font-size:12px;line-height:18px;`;
const FileCard=styled(Card)`padding:20px;overflow:visible;`;
const FileList=styled.div`margin-top:8px;`;
const FileRow=styled.div`display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid ${({theme})=>theme.colors.border};font-size:13px;&:last-child{border-bottom:0;}span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}small{color:${({theme})=>theme.colors.textFooter};font-size:12px;}button{padding:3px 8px;border:1px solid #fecaca;border-radius:5px;background:#fef2f2;color:#ef4444;font-size:11px;}`;
const Empty=styled.p`padding:24px 0;color:${({theme})=>theme.colors.textGray};font-size:14px;text-align:center;`;
const Loading=styled.div`display:grid;min-height:calc(100vh - 57px);place-items:center;color:${({theme})=>theme.colors.textGray};`;
const Overlay=styled.div`position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:20px;background:${({theme})=>theme.colors.bgOverlay};`;
const Modal=styled.div`width:min(320px,100%);padding:24px;border-radius:12px;background:white;box-shadow:0 8px 16px rgba(0,0,0,.12);text-align:center;h2{font-size:16px;line-height:28px;}p{margin-top:4px;color:${({theme})=>theme.colors.textGray};font-size:14px;line-height:22px;}.actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px;}button{height:42px;border:1px solid ${({theme})=>theme.colors.border};border-radius:8px;font-size:14px;}button.danger{border:0;background:#ef4444;color:white;font-weight:700;}`;

const formatBytes=(bytes)=>{if(bytes<1024)return `${bytes} B`;if(bytes<1024**2)return `${Math.round(bytes/1024)} KB`;if(bytes<1024**3)return `${(bytes/1024**2).toFixed(bytes<10*1024**2?1:0)} MB`;return `${(bytes/1024**3).toFixed(1)} GB`;};

export default function SettingsPage(){
 const navigate=useNavigate(); const [tab,setTab]=useState("account"); const [user,setUser]=useState(null); const [accounts,setAccounts]=useState([]); const [storage,setStorage]=useState(null); const [loading,setLoading]=useState(true); const [editingName,setEditingName]=useState(false); const [name,setName]=useState(""); const [editingPassword,setEditingPassword]=useState(false); const [passwords,setPasswords]=useState({current:"",next:""}); const [message,setMessage]=useState(""); const [error,setError]=useState(""); const [deleteTarget,setDeleteTarget]=useState(null);
 const load=useCallback(async()=>{setError("");try{const [profileResponse,accountsResponse,storageResponse]=await Promise.all([getUserProfile(),getAuthAccounts(),getStorage()]);setUser(profileResponse.data);setName(profileResponse.data.name);setAccounts(accountsResponse.data??[]);setStorage(storageResponse.data);}catch(requestError){if(requestError.response?.status===401){navigate("/login",{replace:true});return;}setError(requestError.response?.data?.detail??"설정 정보를 불러오지 못했습니다.");}finally{setLoading(false);}},[navigate]);
 useEffect(()=>{
  // oxlint-disable-next-line react/set-state-in-effect
  load();
 },[load]);
 const accountMap=useMemo(()=>Object.fromEntries(accounts.map(account=>[account.provider,account])),[accounts]);
 const saveName=async()=>{if(!name.trim())return;setError("");try{const {data}=await updateUserName(name.trim());setUser(data);setName(data.name);setEditingName(false);setMessage("이름이 변경되었습니다.");}catch(requestError){setError(requestError.response?.data?.detail??"이름을 변경하지 못했습니다.");}};
 const savePassword=async(event)=>{event.preventDefault();setError("");try{await changePassword(passwords.current,passwords.next);setPasswords({current:"",next:""});setEditingPassword(false);setMessage("비밀번호가 변경되었습니다.");}catch(requestError){setError(requestError.response?.data?.detail??"비밀번호를 변경하지 못했습니다.");}};
 const toggleSocial=async(provider)=>{setError("");if(!accountMap[provider]){startAuthAccountLink(provider);return;}try{await unlinkAuthAccount(provider);setAccounts(current=>current.filter(account=>account.provider!==provider));setMessage(`${provider==="NAVER"?"네이버":"카카오"} 계정 연동을 해제했습니다.`);}catch(requestError){setError(requestError.response?.data?.detail??"계정 연동을 변경하지 못했습니다.");}};
 const handleLogout=async()=>{try{await logout();navigate("/login",{replace:true});}catch(requestError){setError(requestError.response?.data?.detail??"로그아웃하지 못했습니다.");}};
 const removeFile=async()=>{if(!deleteTarget)return;setError("");try{await deleteProjectFile(deleteTarget.id);setStorage(current=>({...current,usedBytes:Math.max(0,current.usedBytes-deleteTarget.sizeBytes),remainingBytes:current.remainingBytes+deleteTarget.sizeBytes,fileCount:Math.max(0,current.fileCount-1),files:current.files.filter(file=>file.id!==deleteTarget.id)}));setDeleteTarget(null);setMessage("파일을 삭제했습니다.");}catch(requestError){setError(requestError.response?.data?.detail??"파일을 삭제하지 못했습니다.");}};
 if(loading)return <Page><AppHeader/><Loading>설정 정보를 불러오는 중입니다.</Loading></Page>;
 if(!user)return <Page><AppHeader/><Loading>{error||"사용자 정보를 확인할 수 없습니다."}</Loading></Page>;
 const percent=storage?.quotaBytes?Math.min(100,Math.round(storage.usedBytes/storage.quotaBytes*100)):0;
 return <Page><AppHeader userName={user.name}/><Shell><Sidebar><span>설정</span><nav><button className={tab==="account"?"active":""} onClick={()=>setTab("account")}>계정</button><button className={tab==="files"?"active":""} onClick={()=>setTab("files")}>데이터/파일 관리</button></nav></Sidebar><Main>
  {tab==="account"?<><Heading>계정</Heading><Card><Profile><BigAvatar>{user.name.charAt(0)}</BigAvatar><ProfileText><strong>{user.name}</strong><span>{user.email}</span></ProfileText></Profile><Row><Label>이름</Label>{editingName?<EditLine><input value={name} onChange={event=>setName(event.target.value)} maxLength={100}/><Button className="primary" onClick={saveName}>저장</Button><Button onClick={()=>{setName(user.name);setEditingName(false);}}>취소</Button></EditLine>:<ValueLine><span>{user.name}</span><button onClick={()=>setEditingName(true)}>수정</button></ValueLine>}</Row><Row><Label>이메일</Label><ValueLine $muted><span>{user.email}</span></ValueLine></Row><Row><Label>비밀번호</Label>{editingPassword?<PasswordForm onSubmit={savePassword}><input type="password" placeholder="현재 비밀번호" value={passwords.current} onChange={event=>setPasswords(current=>({...current,current:event.target.value}))}/><input type="password" minLength={8} placeholder="새 비밀번호 (8자 이상)" value={passwords.next} onChange={event=>setPasswords(current=>({...current,next:event.target.value}))}/><div className="actions"><Button className="primary" type="submit" disabled={!passwords.current||passwords.next.length<8}>변경</Button><Button type="button" onClick={()=>{setPasswords({current:"",next:""});setEditingPassword(false);}}>취소</Button></div></PasswordForm>:<ValueLine $muted><span>••••••••</span><button onClick={()=>setEditingPassword(true)}>변경</button></ValueLine>}</Row><Row><Label>소셜 계정 연동</Label><SocialList>{["NAVER","KAKAO"].map(provider=>{const account=accountMap[provider];return <Social key={provider} $provider={provider} $linked={Boolean(account)}><SocialInfo $provider={provider}><img src={provider==="NAVER"?naverIcon:kakaoIcon} alt=""/><div><strong>{provider==="NAVER"?"네이버":"카카오"}</strong><span>{account?.email?`${account.email} · 연동됨`:account?"연동됨":"연동되지 않음"}</span></div></SocialInfo><SocialButton $provider={provider} $linked={Boolean(account)} onClick={()=>toggleSocial(provider)}>{account?"연동 해제":"연동하기"}</SocialButton></Social>})}</SocialList></Row><LogoutRow><button onClick={handleLogout}>로그아웃</button></LogoutRow></Card></>:<><Heading>데이터/파일 관리</Heading><Description>저장된 파일을 삭제하면, 경험 카드의 근거도 함께 삭제됩니다.</Description><StorageCard><Label>저장공간</Label><StorageTop><strong>{formatBytes(storage?.usedBytes??0)} 사용 중</strong><span>{formatBytes(storage?.quotaBytes??0)} 기본 제공</span></StorageTop><Progress><i style={{width:`${percent}%`}}/></Progress><StorageCaption>{formatBytes(storage?.remainingBytes??0)} 남음 · {percent}% 사용</StorageCaption></StorageCard><FileCard><Label>업로드 파일 {storage?.fileCount??0}개</Label><FileList>{storage?.files?.length?storage.files.map(file=><FileRow key={file.id}><span>{file.originalName}</span><small>{formatBytes(file.sizeBytes)}</small><button onClick={()=>setDeleteTarget(file)}>삭제</button></FileRow>):<Empty>업로드한 파일이 없습니다.</Empty>}</FileList></FileCard></>}
  {(message||error)&&<Notice $error={Boolean(error)}>{error||message}</Notice>}
 </Main></Shell>{deleteTarget&&<Overlay onMouseDown={event=>event.target===event.currentTarget&&setDeleteTarget(null)}><Modal role="dialog" aria-modal="true"><h2>파일을 삭제할까요?</h2><p>삭제한 파일은 복구할 수 없습니다.</p><div className="actions"><button onClick={()=>setDeleteTarget(null)}>취소</button><button className="danger" onClick={removeFile}>삭제</button></div></Modal></Overlay>}</Page>;
}
