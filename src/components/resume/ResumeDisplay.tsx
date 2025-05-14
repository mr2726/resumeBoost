
// @ts-nocheck
"use client";

import type { GenerateResumeContentOutput } from '@/ai/flows/generate-resume-content';
import { cn } from '@/lib/utils'; 
import React from 'react';

interface ResumeDisplayProps {
  resumeData: GenerateResumeContentOutput;
  isPreview?: boolean;
}

export default function ResumeDisplay({ resumeData, isPreview = false }: ResumeDisplayProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
    }
  };

  const styles = {
    resumeContainer: {
      width: '794px',
      minHeight: '1123px', 
      margin: '0 auto', // Centering on screen for StaticResumePreview, page styles handle body
      background: '#F9FAFB',
      color: '#1F2937',
      fontFamily: 'var(--font-open-sans)',
      boxSizing: 'border-box',
      position: 'relative', 
      overflow: 'hidden', 
      userSelect: isPreview ? 'none' : 'auto',
      // boxShadow removed from here, StaticResumePreview adds its own shadow
      padding: '75px', 
    } as React.CSSProperties,
    header: {
      textAlign: 'center',
      paddingBottom: '12px', 
      marginBottom: '0px', 
      height: '120px', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    } as React.CSSProperties,
    candidateName: {
      fontFamily: 'var(--font-montserrat)',
      fontSize: '22px',
      fontWeight: 700,
      color: '#1F2937',
      margin: '0 0 8px 0', 
      lineHeight: 1.2,
    } as React.CSSProperties,
    contactDetails: {
      fontSize: '10px',
      color: '#1F2937',
      fontFamily: 'var(--font-open-sans)',
      lineHeight: 1.5,
      maxWidth: '600px', 
      margin: '0 auto', 
    } as React.CSSProperties,
    contactSeparator: {
      color: '#0D9488', 
      margin: '0 8px', 
    } as React.CSSProperties,
    headerDivider: {
      width: '80%',
      height: '1px',
      background: '#E5E7EB', 
      margin: '20px auto 0 auto', 
    } as React.CSSProperties,
    section: {
      marginTop: '24px', 
      marginBottom: '0px', 
    } as React.CSSProperties,
    sectionTitle: {
      fontFamily: 'var(--font-montserrat)',
      fontSize: '14px',
      fontWeight: 700,
      color: '#1F2937',
      margin: '0 0 8px 0', 
      position: 'relative',
      paddingBottom: '6px', 
      lineHeight: 1.2,
    } as React.CSSProperties,
    sectionTitleUnderline: {
      content: '""',
      position: 'absolute',
      bottom: '0px', 
      left: '0',
      width: '20px', 
      height: '2px',
      background: '#0D9488', 
    } as React.CSSProperties,
    sectionDivider: {
      width: '90%', 
      height: '1px',
      background: '#E5E7EB', 
      margin: '16px auto 0 auto', 
    } as React.CSSProperties,
    aboutMeSection: { 
        overflow: 'hidden',
    },
    aboutMeText: {
      fontSize: '11px',
      fontFamily: 'var(--font-open-sans)',
      color: '#1F2937',
      lineHeight: 1.5,
      textAlign: 'justify',
      marginBottom: '8px', 
    } as React.CSSProperties,
    skillsSection: { 
        overflow: 'hidden',
    },
    skillsListContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    } as React.CSSProperties,
    skillsColumn: {
      width: 'calc(50% - 10px)', 
      paddingLeft: '0px', 
      margin: 0, 
    } as React.CSSProperties,
    listItem: {
      fontSize: '11px',
      fontFamily: 'var(--font-open-sans)',
      color: '#1F2937',
      lineHeight: 1.5,
      marginBottom: '6px', 
      listStyleType: 'none', 
      position: 'relative',
      paddingLeft: '15px', 
    } as React.CSSProperties,
    customBullet: {
      content: '""',
      position: 'absolute',
      left: '0',
      top: 'calc(1.5em / 2 - 2px)', 
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: '#0D9488', 
    } as React.CSSProperties,
    languagesSection: { 
        overflow: 'hidden',
    },
    languagesList: {
      paddingLeft: '0px',
      margin: 0, 
    } as React.CSSProperties,
    experienceSection: { 
        overflow: 'hidden',
    },
    experienceEntry: {
      marginBottom: '12px', 
    } as React.CSSProperties,
    jobTitle: {
      fontSize: '12px',
      fontFamily: 'var(--font-open-sans)',
      fontWeight: 600,
      color: '#1F2937',
      marginBottom: '2px',
    } as React.CSSProperties,
    companyDates: {
      fontSize: '11px',
      fontFamily: 'var(--font-open-sans)',
      fontStyle: 'italic',
      color: '#1F2937', 
      marginBottom: '4px',
    } as React.CSSProperties,
    dutiesList: {
      fontSize: '11px',
      fontFamily: 'var(--font-open-sans)',
      color: '#1F2937',
      lineHeight: 1.5,
      paddingLeft: '0px', 
      margin: '4px 0 0 0',
    } as React.CSSProperties,
    watermarkContainer: { 
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      pointerEvents: 'none', 
      zIndex: 10, 
    } as React.CSSProperties,
    watermarkText: {
      fontFamily: 'var(--font-montserrat)', // Spec used Montserrat Regular, ensure it is loaded
      fontSize: '30px',
      color: 'rgba(107, 114, 128, 0.5)', 
      position: 'absolute',
      transformOrigin: 'center center',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    } as React.CSSProperties,
  };
  
  const renderWatermarks = () => {
    if (!isPreview) {
      return null;
    }

    const watermarkPositions = [
      { top: '150px', left: '50px', transform: 'rotate(-35deg) scale(0.9)' },
      { top: '350px', left: '280px', transform: 'rotate(-35deg) scale(1.1)' },
      { top: '550px', left: '100px', transform: 'rotate(-35deg) scale(1.0)' },
      { top: '750px', left: '350px', transform: 'rotate(-35deg) scale(0.9)' },
      { top: '50px', left: '400px', transform: 'rotate(-35deg) scale(0.8)' },
    ];

    return (
      <div style={styles.watermarkContainer}>
        {watermarkPositions.map((pos, index) => (
          <div
            key={`watermark-${index}`}
            style={{
              ...styles.watermarkText,
              top: pos.top,
              left: pos.left,
              transform: pos.transform,
            }}
          >
            ResumeBoost Preview
          </div>
        ))}
      </div>
    );
  };
  
  const { name, contact, aboutMe, skills, languages, workExperience } = resumeData || {};

  if (!resumeData) {
    return <div style={{...styles.resumeContainer, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p>Loading resume data...</p></div>;
  }

  const contactElements = [];
  if (contact?.email) contactElements.push(contact.email);
  if (contact?.phone) contactElements.push(contact.phone);
  if (contact?.linkedin) contactElements.push(contact.linkedin);


  return (
    <div 
      style={styles.resumeContainer}
      onContextMenu={handleContextMenu}
      className={cn(isPreview && "select-none")} 
    >
      {renderWatermarks()}
      <div style={{position: 'relative', zIndex: 1}}> {/* Content wrapper */}
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.candidateName}>{name || 'Candidate Name'}</h1>
          {contact && (
            <div style={styles.contactDetails}>
              {contactElements.map((item, index) => (
                <React.Fragment key={index}>
                  {item}
                  {index < contactElements.length - 1 && <span style={styles.contactSeparator}>|</span>}
                </React.Fragment>
              ))}
            </div>
          )}
          <div style={styles.headerDivider}></div>
        </div>

        {/* About Me */}
        {aboutMe && (
          <div style={{...styles.section, ...styles.aboutMeSection}}>
            <h2 style={styles.sectionTitle}>
              About Me
              <span style={styles.sectionTitleUnderline}></span>
            </h2>
            <p style={styles.aboutMeText}>{aboutMe}</p>
            <div style={styles.sectionDivider}></div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div style={{...styles.section, ...styles.skillsSection}}>
            <h2 style={styles.sectionTitle}>
              Skills
              <span style={styles.sectionTitleUnderline}></span>
            </h2>
            <div style={styles.skillsListContainer}>
              <ul style={{...styles.skillsColumn, listStyleType: 'none'}}>
                {skills.slice(0, Math.ceil(skills.length / 2)).map((skill, index) => (
                  <li key={`skill-col1-${index}`} style={styles.listItem}>
                    <span style={styles.customBullet}></span>{skill}
                  </li>
                ))}
              </ul>
              {skills.length > 1 && (
                 <ul style={{...styles.skillsColumn, listStyleType: 'none'}}>
                    {skills.slice(Math.ceil(skills.length / 2)).map((skill, index) => (
                    <li key={`skill-col2-${index}`} style={styles.listItem}>
                        <span style={styles.customBullet}></span>{skill}
                    </li>
                    ))}
                </ul>
              )}
            </div>
            <div style={styles.sectionDivider}></div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div style={{...styles.section, ...styles.languagesSection}}>
            <h2 style={styles.sectionTitle}>
              Languages
              <span style={styles.sectionTitleUnderline}></span>
            </h2>
            <ul style={{...styles.languagesList, listStyleType: 'none'}}>
              {languages.map((lang, index) => (
                <li key={`lang-${index}`} style={styles.listItem}>
                  <span style={styles.customBullet}></span>{lang.name} - {lang.proficiency}
                </li>
              ))}
            </ul>
            <div style={styles.sectionDivider}></div>
          </div>
        )}

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <div style={{...styles.section, ...styles.experienceSection}}>
            <h2 style={styles.sectionTitle}>
              Work Experience
              <span style={styles.sectionTitleUnderline}></span>
            </h2>
            {workExperience.map((exp, index) => (
              <div key={`exp-${index}`} style={styles.experienceEntry}>
                <div style={styles.jobTitle}>{exp.jobTitle}</div>
                <div style={styles.companyDates}>{exp.company} | {exp.dates}</div>
                {exp.duties && exp.duties.length > 0 && (
                  <ul style={{...styles.dutiesList, listStyleType: 'none'}}>
                    {exp.duties.map((duty, dutyIndex) => (
                      <li key={`duty-${index}-${dutyIndex}`} style={styles.listItem}>
                        <span style={styles.customBullet}></span>{duty}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {/* No divider after the last section as per spec */}
          </div>
        )}
      </div>
    </div>
  );
}

