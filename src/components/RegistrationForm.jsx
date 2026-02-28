import React, { useState } from 'react'
import { DISTRICTS } from '../constants/districts'
import { saveCenterRegistrationWithPhotos } from '../services/firebaseService'

const initialForm = {
  centerName: '',
  village: '',
  pincode: '',
  district: '',
  population: '',
  inchargeName: '',
  inchargeGender: '',
  inchargeMobile: '',
  inchargeEmail: '',
  inchargeEducation: '',
  inchargeSportsQual: '',
  inchargeSportsAchievement: '',
  inchargeOccupation: '',
  inchargeIncome: '',
  coachName: '',
  coachGender: '',
  coachMobile: '',
  coachEmail: '',
  coachEducation: '',
  coachSportsQual: '',
  coachSportsAchievement: '',
  coachOccupation: '',
  coachIncome: '',
  numCourts: '',
  ownership: '',
  floodLights: '',
  drinkingWater: '',
  toilets: '',
  runBy: '',
  numMembers: '',
  bankAccount: '',
  fundingSource: '',
  playersBoys: '',
  playersGirls: '',
  playersTotal: '',
  bvlSeason: '',
  stateBoys: '0',
  stateGirls: '0',
  stateTotal: '0',
  districtBoys: '0',
  districtGirls: '0',
  districtTotal: '0',
  numReferees: '0',
  tournaments: '',
  tournamentDetails: '',
  declaration: false,
}

export default function RegistrationForm({ onSuccess }) {
  const [form, setForm] = useState(initialForm)
  const [showTournamentDetails, setShowTournamentDetails] = useState(false)
  const [inchargePhotoData, setInchargePhotoData] = useState(null)
  const [courtPhotoData, setCourtPhotoData] = useState(null)
  const [coachGroupPhotoData, setCoachGroupPhotoData] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm((prev) => {
      const next = { ...prev, [name]: val }
      if (name === 'playersBoys' || name === 'playersGirls') {
        const boys = name === 'playersBoys' ? val : prev.playersBoys
        const girls = name === 'playersGirls' ? val : prev.playersGirls
        next.playersTotal = String((parseInt(boys) || 0) + (parseInt(girls) || 0))
      }
      if (name === 'stateBoys' || name === 'stateGirls') {
        const boys = name === 'stateBoys' ? val : prev.stateBoys
        const girls = name === 'stateGirls' ? val : prev.stateGirls
        next.stateTotal = String((parseInt(boys) || 0) + (parseInt(girls) || 0))
      }
      if (name === 'districtBoys' || name === 'districtGirls') {
        const boys = name === 'districtBoys' ? val : prev.districtBoys
        const girls = name === 'districtGirls' ? val : prev.districtGirls
        next.districtTotal = String((parseInt(boys) || 0) + (parseInt(girls) || 0))
      }
      return next
    })
    if (name === 'tournaments') setShowTournamentDetails(value === 'Yes')
  }

  const readFile = (file) => {
    if (!file || file.size > 5 * 1024 * 1024) {
      alert('Photo size must be less than 5MB')
      return null
    }
    return new Promise((resolve) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result)
      r.readAsDataURL(file)
    })
  }

  const handleInchargePhoto = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const data = await readFile(file)
      if (data) setInchargePhotoData(data)
    }
    e.target.value = ''
  }

  const handleCourtPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const data = await readFile(file)
      if (data) setCourtPhotoData(data)
    }
    e.target.value = ''
  }

  const handleCoachGroupPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const data = await readFile(file)
      if (data) setCoachGroupPhotoData(data)
    }
    e.target.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!inchargePhotoData) {
      alert('⚠️ Please take or upload In-charge photograph')
      return
    }
    if (!courtPhotoData) {
      alert('⚠️ Please upload Court with Team photograph')
      return
    }
    setSubmitting(true)
    try {
      const formData = { ...form }
      delete formData.declaration
      const { registrationId } = await saveCenterRegistrationWithPhotos(formData, {
        inchargePhoto: inchargePhotoData,
        courtPhoto: courtPhotoData,
        coachGroupPhoto: coachGroupPhotoData || null,
      })
      onSuccess(registrationId)
      setForm(initialForm)
      setInchargePhotoData(null)
      setCourtPhotoData(null)
      setCoachGroupPhotoData(null)
      setShowTournamentDetails(false)
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.'
      setError(msg)
      console.error('Registration error:', err)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm(initialForm)
    setShowTournamentDetails(false)
    setInchargePhotoData(null)
    setCourtPhotoData(null)
    setCoachGroupPhotoData(null)
  }

  return (
    <div className="tab-content active">
      <div className="info-box">
        <p><strong>Important:</strong> All new and existing BVL centers must compulsorily register for Season 7.</p>
      </div>

      {error && (
        <div role="alert" className="info-box" style={{ borderLeftColor: '#dc2626', background: '#fee2e2', marginBottom: '15px' }}>
          <p style={{ color: '#991b1b' }}><strong>Registration failed:</strong> {error}</p>
          <p style={{ fontSize: '0.85em', marginTop: '8px' }}>Check Firebase: Firestore rules must allow create on <code>centers</code>. Storage rules must allow create on <code>centers/*</code> for photo uploads.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Center Information */}
        <div className="section">
          <h2 className="section-title">Center Information</h2>
          <div className="form-group">
            <label>Name of the Center <span className="required">*</span></label>
            <input type="text" name="centerName" value={form.centerName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Village <span className="required">*</span></label>
            <input type="text" name="village" value={form.village} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>PIN Code <span className="required">*</span></label>
            <input type="tel" name="pincode" pattern="[0-9]{6}" maxLength={6} value={form.pincode} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>District <span className="required">*</span></label>
            <select name="district" value={form.district} onChange={handleChange} required>
              <option value="">Select District</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Population of the Village <span className="required">*</span></label>
            <input type="number" name="population" value={form.population} onChange={handleChange} required />
          </div>
        </div>

        {/* Section 2: Center In-charge Details */}
        <div className="section">
          <h2 className="section-title">Center In-charge Details</h2>
          <div className="form-group">
            <label>Name of In-charge <span className="required">*</span></label>
            <input type="text" name="inchargeName" value={form.inchargeName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Gender <span className="required">*</span></label>
            <div className="radio-group">
              <div className="radio-item">
                <input type="radio" name="inchargeGender" value="Male" id="male" checked={form.inchargeGender === 'Male'} onChange={handleChange} required />
                <label htmlFor="male">Male</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="inchargeGender" value="Female" id="female" checked={form.inchargeGender === 'Female'} onChange={handleChange} required />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Mobile Number <span className="required">*</span></label>
            <input type="tel" name="inchargeMobile" pattern="[0-9]{10}" maxLength={10} value={form.inchargeMobile} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email ID <span className="required">*</span></label>
            <input type="email" name="inchargeEmail" value={form.inchargeEmail} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Education Qualification <span className="required">*</span></label>
            <input type="text" name="inchargeEducation" value={form.inchargeEducation} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Sports Qualification</label>
            <input type="text" name="inchargeSportsQual" value={form.inchargeSportsQual} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Highest Sports Achievement</label>
            <input type="text" name="inchargeSportsAchievement" value={form.inchargeSportsAchievement} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Occupation</label>
            <input type="text" name="inchargeOccupation" value={form.inchargeOccupation} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Annual Income (Optional)</label>
            <input type="text" name="inchargeIncome" value={form.inchargeIncome} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>In-charge Photograph <span className="required">*</span></label>
            <p style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '8px' }}>Take selfie or upload photo</p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <label htmlFor="inchargePhotoCamera" className="btn btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.9em', textAlign: 'center', margin: 0 }}>
                📷 Camera
              </label>
              <label htmlFor="inchargePhotoFile" className="btn btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.9em', textAlign: 'center', margin: 0 }}>
                🖼️ Upload
              </label>
            </div>
            <input type="file" id="inchargePhotoCamera" accept="image/*" capture="user" style={{ display: 'none' }} onChange={handleInchargePhoto} />
            <input type="file" id="inchargePhotoFile" accept="image/*" style={{ display: 'none' }} onChange={handleInchargePhoto} />
            <div style={{ marginTop: '10px' }}>
              {inchargePhotoData && (
                <div className="photo-container">
                  <img src={inchargePhotoData} className="photo-preview" alt="In-charge" />
                  <button type="button" className="remove-photo" onClick={() => setInchargePhotoData(null)}>×</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Head Coach Details */}
        <div className="section">
          <h2 className="section-title">Head Coach Details</h2>
          <p style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '12px' }}>Fill only if Head Coach is different from In-charge</p>
          <div className="form-group">
            <label>Name of Head Coach</label>
            <input type="text" name="coachName" value={form.coachName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <div className="radio-group">
              <div className="radio-item">
                <input type="radio" name="coachGender" value="Male" id="coachMale" checked={form.coachGender === 'Male'} onChange={handleChange} />
                <label htmlFor="coachMale">Male</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="coachGender" value="Female" id="coachFemale" checked={form.coachGender === 'Female'} onChange={handleChange} />
                <label htmlFor="coachFemale">Female</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="tel" name="coachMobile" pattern="[0-9]{10}" maxLength={10} value={form.coachMobile} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email ID</label>
            <input type="email" name="coachEmail" value={form.coachEmail} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Education Qualification</label>
            <input type="text" name="coachEducation" value={form.coachEducation} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Sports Qualification</label>
            <input type="text" name="coachSportsQual" value={form.coachSportsQual} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Highest Sports Achievement</label>
            <input type="text" name="coachSportsAchievement" value={form.coachSportsAchievement} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Occupation</label>
            <input type="text" name="coachOccupation" value={form.coachOccupation} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Annual Income (Optional)</label>
            <input type="text" name="coachIncome" value={form.coachIncome} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Head Coach with Players Group Photo</label>
            <p style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '8px' }}>Upload photo of Head Coach with all players</p>
            <input type="file" accept="image/*" style={{ padding: '10px', border: '2px solid #bfdbfe', borderRadius: '8px', width: '100%' }} onChange={handleCoachGroupPhoto} />
            {coachGroupPhotoData && (
              <div style={{ marginTop: '10px' }}>
                <div className="photo-container">
                  <img src={coachGroupPhotoData} className="photo-preview" alt="Coach group" />
                  <button type="button" className="remove-photo" onClick={() => setCoachGroupPhotoData(null)}>×</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Infrastructure & Facilities */}
        <div className="section">
          <h2 className="section-title">Infrastructure & Facilities</h2>
          <div className="form-group">
            <label>Number of Courts <span className="required">*</span></label>
            <input type="number" name="numCourts" min={1} value={form.numCourts} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Ownership of Court <span className="required">*</span></label>
            <div className="radio-group">
              {['School', 'Government', 'Community', 'Individual'].map((opt) => (
                <div key={opt} className="radio-item">
                  <input type="radio" name="ownership" value={opt === 'Government' ? 'Government' : opt} id={`owner${opt}`} checked={form.ownership === (opt === 'Government' ? 'Government' : opt)} onChange={handleChange} required />
                  <label htmlFor={`owner${opt}`}>{opt === 'Government' ? 'Govt' : opt}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Flood Lights Facilities <span className="required">*</span></label>
            <div className="radio-group">
              <div className="radio-item">
                <input type="radio" name="floodLights" value="Yes" id="floodYes" checked={form.floodLights === 'Yes'} onChange={handleChange} required />
                <label htmlFor="floodYes">Yes</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="floodLights" value="No" id="floodNo" checked={form.floodLights === 'No'} onChange={handleChange} required />
                <label htmlFor="floodNo">No</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Drinking Water Facilities <span className="required">*</span></label>
            <div className="radio-group">
              <div className="radio-item">
                <input type="radio" name="drinkingWater" value="Yes" id="waterYes" checked={form.drinkingWater === 'Yes'} onChange={handleChange} required />
                <label htmlFor="waterYes">Yes</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="drinkingWater" value="No" id="waterNo" checked={form.drinkingWater === 'No'} onChange={handleChange} required />
                <label htmlFor="waterNo">No</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Toilet Facilities <span className="required">*</span></label>
            <div className="radio-group">
              <div className="radio-item">
                <input type="radio" name="toilets" value="Common" id="toiletCommon" checked={form.toilets === 'Common'} onChange={handleChange} required />
                <label htmlFor="toiletCommon">Common</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="toilets" value="Separate" id="toiletSeparate" checked={form.toilets === 'Separate'} onChange={handleChange} required />
                <label htmlFor="toiletSeparate">Separate</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="toilets" value="No" id="toiletNo" checked={form.toilets === 'No'} onChange={handleChange} required />
                <label htmlFor="toiletNo">No</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Playing Court with Team Photograph <span className="required">*</span></label>
            <p style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '8px' }}>Upload photo of volleyball court with team members</p>
            <input type="file" accept="image/*" style={{ padding: '10px', border: '2px solid #bfdbfe', borderRadius: '8px', width: '100%' }} onChange={handleCourtPhoto} />
            {courtPhotoData && (
              <div style={{ marginTop: '10px' }}>
                <div className="photo-container">
                  <img src={courtPhotoData} className="photo-preview" alt="Court" />
                  <button type="button" className="remove-photo" onClick={() => setCourtPhotoData(null)}>×</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Organizational Details */}
        <div className="section">
          <h2 className="section-title">Organizational Details</h2>
          <div className="form-group">
            <label>Center Run By <span className="required">*</span></label>
            <div className="radio-group">
              <div className="radio-item">
                <input type="radio" name="runBy" value="Registered Committee" id="runCommittee" checked={form.runBy === 'Registered Committee'} onChange={handleChange} required />
                <label htmlFor="runCommittee">Registered Committee</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="runBy" value="Individual" id="runIndividual" checked={form.runBy === 'Individual'} onChange={handleChange} required />
                <label htmlFor="runIndividual">Individual</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="runBy" value="Group (Not Registered)" id="runGroup" checked={form.runBy === 'Group (Not Registered)'} onChange={handleChange} required />
                <label htmlFor="runGroup">Group (Not Registered)</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Number of Committee Members/Volunteers <span className="required">*</span></label>
            <input type="number" name="numMembers" min={0} value={form.numMembers} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Bank Account in Center's Name <span className="required">*</span></label>
            <div className="radio-group">
              <div className="radio-item">
                <input type="radio" name="bankAccount" value="Yes" id="bankYes" checked={form.bankAccount === 'Yes'} onChange={handleChange} required />
                <label htmlFor="bankYes">Yes</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="bankAccount" value="No" id="bankNo" checked={form.bankAccount === 'No'} onChange={handleChange} required />
                <label htmlFor="bankNo">No</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Current Funding Source <span className="required">*</span></label>
            <input type="text" name="fundingSource" placeholder="Self-funded / Government / Donations etc." value={form.fundingSource} onChange={handleChange} required />
          </div>
        </div>

        {/* Section 6: Players & Participation */}
        <div className="section">
          <h2 className="section-title">Players & Participation</h2>
          <div className="subsection">
            <div className="subsection-title">Registered Players</div>
            <div className="form-row">
              <div className="form-group">
                <label>Boys <span className="required">*</span></label>
                <input type="number" name="playersBoys" min={0} value={form.playersBoys} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Girls <span className="required">*</span></label>
                <input type="number" name="playersGirls" min={0} value={form.playersGirls} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Total</label>
                <input type="number" name="playersTotal" value={form.playersTotal} readOnly style={{ background: '#f3f4f6' }} />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>BVL Season Participated <span className="required">*</span></label>
            <select name="bvlSeason" value={form.bvlSeason} onChange={handleChange} required>
              <option value="">Select Season</option>
              {['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Season 5', 'Season 6', 'Season 7 (New)'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="subsection">
            <div className="subsection-title">State Players from Center</div>
            <div className="form-row">
              <div className="form-group">
                <label>Boys</label>
                <input type="number" name="stateBoys" min={0} value={form.stateBoys} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Girls</label>
                <input type="number" name="stateGirls" min={0} value={form.stateGirls} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Total</label>
                <input type="number" name="stateTotal" value={form.stateTotal} readOnly style={{ background: '#f3f4f6' }} />
              </div>
            </div>
          </div>
          <div className="subsection">
            <div className="subsection-title">District Players</div>
            <div className="form-row">
              <div className="form-group">
                <label>Boys</label>
                <input type="number" name="districtBoys" min={0} value={form.districtBoys} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Girls</label>
                <input type="number" name="districtGirls" min={0} value={form.districtGirls} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Total</label>
                <input type="number" name="districtTotal" value={form.districtTotal} readOnly style={{ background: '#f3f4f6' }} />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Qualified District/State Level Referees</label>
            <input type="number" name="numReferees" min={0} value={form.numReferees} onChange={handleChange} />
          </div>
        </div>

        {/* Section 7: Tournament History */}
        <div className="section">
          <h2 className="section-title">Tournament History</h2>
          <div className="form-group">
            <label>Organized State Level Tournaments <span className="required">*</span></label>
            <div className="radio-group">
              <div className="radio-item">
                <input type="radio" name="tournaments" value="Yes" id="tournamentYes" checked={form.tournaments === 'Yes'} onChange={handleChange} required />
                <label htmlFor="tournamentYes">Yes</label>
              </div>
              <div className="radio-item">
                <input type="radio" name="tournaments" value="No" id="tournamentNo" checked={form.tournaments === 'No'} onChange={handleChange} required />
                <label htmlFor="tournamentNo">No</label>
              </div>
            </div>
          </div>
          {showTournamentDetails && (
            <div className="form-group">
              <label>Tournament Details (Name, Year, Level)</label>
              <textarea name="tournamentDetails" placeholder="Please provide details of state level tournaments organized..." value={form.tournamentDetails} onChange={handleChange} />
            </div>
          )}
        </div>

        {/* Declaration */}
        <div className="section">
          <h2 className="section-title">Declaration</h2>
          <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '15px', lineHeight: 1.5 }}>
            I hereby declare that the information provided above is true and accurate to the best of my knowledge.
            I understand that this registration is mandatory for participation in BVL Season 7 onwards.
          </p>
          <div className="radio-item">
            <input type="checkbox" id="declaration" name="declaration" checked={form.declaration} onChange={handleChange} required />
            <label htmlFor="declaration">I agree to the above declaration <span className="required">*</span></label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Registration'}</button>
        <button type="button" className="btn btn-secondary" onClick={resetForm}>Reset Form</button>
      </form>
    </div>
  )
}
